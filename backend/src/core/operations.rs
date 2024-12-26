// operations.rs
use rusqlite::{params, Connection};

use axum::{http::StatusCode, response::Json as AxumJson};

use crate::core::traits::{Mappable, Insertable};
use crate::core::types::DbPool;
use serde_json::json;

use r2d2::PooledConnection;
use r2d2_sqlite::SqliteConnectionManager;

pub fn establish_connection(
    pool: &DbPool,
) -> Result<PooledConnection<SqliteConnectionManager>, (StatusCode, AxumJson<serde_json::Value>)> {
    pool.get().map_err(|_| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            AxumJson(json!({ "error": "Failed to get connection" })),
        )
    })
}

pub fn update_record<T: Insertable>(conn: &Connection, item: &T) -> rusqlite::Result<()> {
    let table = T::table_name();
    let columns = T::columns();
    let id_column = T::id_column();
    let set_clause = columns
        .iter()
        .enumerate()
        .map(|(i, col)| format!("{} = ?{}", col, i + 2))
        .collect::<Vec<String>>()
        .join(", ");

    let query = format!(
        "UPDATE {} SET {} WHERE {} = ?1",
        table, set_clause, id_column
    );

    let mut params = vec![item.id_value().into()];
    params.extend(item.values());

    conn.execute(&query, rusqlite::params_from_iter(params))?;
    Ok(())
}

pub fn find_record_by_id<T: Mappable + Insertable>(
    conn: &Connection,
    id_value: i32,
) -> rusqlite::Result<T> {
    let table = T::table_name();
    let id_column = T::id_column();
    let query = format!("SELECT * FROM {} WHERE {} = ?1", table, id_column);
    let mut stmt = conn.prepare(&query)?;
    let mut iter = stmt.query_map([id_value], |row| T::from_row(row))?;

    iter.next()
        .ok_or_else(|| rusqlite::Error::QueryReturnedNoRows)?
        .map_err(|err| err)
}

pub fn insert_record<T: Mappable + Insertable>(conn: &Connection, item: &T) -> rusqlite::Result<()> {
    if T::check_duplicate(conn, item.id_value()) {
        return Err(rusqlite::Error::ToSqlConversionFailure(Box::new(
            std::io::Error::new(
                std::io::ErrorKind::InvalidInput,
                format!("Article ID {} is already beeing used.", item.id_value()).to_string(),
            ),
        )));
    }

    let table = T::table_name();
    let columns = T::columns();

    let columns_str = columns.join(", ");
    let placeholders = (1..=columns.len())
        .map(|i| format!("?{}", i))
        .collect::<Vec<String>>()
        .join(", ");

    let query = format!(
        "INSERT INTO {} ({}) VALUES ({})",
        table, columns_str, placeholders
    );

    let values = item.values();

    conn.execute(&query, rusqlite::params_from_iter(values))?;
    Ok(())
}

pub fn fetch_all_records<T: Insertable + Mappable + std::fmt::Debug>(
    conn: &Connection,
) -> rusqlite::Result<Vec<T>> {
    let table = T::table_name();
    let columns = T::columns().join(",");

    let query = format!("SELECT {} FROM {}", columns, table);

    let mut stmt = conn.prepare(&query)?;

    let iter = stmt.query_map([], |row| T::from_row(row))?;

    let mut item_list = Vec::new();
    for item in iter {
        item_list.push(item?);
    }
    Ok(item_list)
}

pub fn initialize_tables(conn: &Connection) -> rusqlite::Result<()> {
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS article (
            id             INTEGER PRIMARY KEY,
            article_id  INTEGER NOT NULL,
            price          REAL NOT NULL,
            manufacturer     TEXT NOT NULL,
            stock          INTEGER NOT NULL, 
            category       TEXT
        ); 
        CREATE TABLE IF NOT EXISTS customer (
            id             INTEGER PRIMARY KEY,
            customer_id  INTEGER NOT NULL,
            first_name          TEXT NOT NULL,
            last_name     TEXT NOT NULL,
            street          TEXT NOT NULL, 
            location       TEXT NOT NULL,
            zip_code       INTEGER NOT NULL,
            email       TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS orders ( 
            id             INTEGER PRIMARY KEY,
            order_id       INTEGER NOT NULL,
            customer_id    INTEGER NOT NULL,
            article_id     INTEGER NOT NULL
        )",
    )?;
    Ok(())
}

pub fn delete_record_by_id<T: Insertable>(
    conn: &Connection,
    id: &Option<i32>,
) -> rusqlite::Result<()> {
    let id_column = T::id_column();
    let table = T::table_name();

    match id {
        Some(id) => {
            let query = format!("DELETE FROM {} WHERE {} = ?1", table, id_column);
            conn.execute(&query, params![id])?;
        }
        None => {
            let query = format!("DELETE FROM {}", table);
            conn.execute(&query, params![])?;
        }
    }
    Ok(())
}
