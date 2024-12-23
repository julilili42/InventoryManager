// operations.rs
use crate::core::types::Article;
use rusqlite::params;

use axum::{http::StatusCode, response::Json as AxumJson};

use crate::core::types::DbPool;
use serde_json::json;

use r2d2::PooledConnection;
use r2d2_sqlite::SqliteConnectionManager;

// Ideen
// Article als Parameter übergeben --> Leichter Felder hinzufügen

pub fn get_connection(
    pool: &DbPool,
) -> Result<PooledConnection<SqliteConnectionManager>, (StatusCode, AxumJson<serde_json::Value>)> {
    pool.get().map_err(|_| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            AxumJson(json!({ "error": "Failed to get connection" })),
        )
    })
}

pub fn update_article(conn: &rusqlite::Connection, article: Article) -> rusqlite::Result<()> {
    conn.execute(
        "UPDATE article 
        SET price = ?2, manufacturer = ?3, stock = ?4, category = ?5
        WHERE article_id = ?1",
        params![
            article.article_id,
            article.price,
            article.manufacturer,
            article.stock,
            article.category,
        ],
    )?;
    Ok(())
}

pub fn search_article(conn: &rusqlite::Connection, article_id: i32) -> rusqlite::Result<Article> {
    let mut stmt = conn.prepare(
        "SELECT article_id, price, manufacturer, stock, category 
        FROM article WHERE article_id = ?1",
    )?;
    let article_iter = stmt.query_map(params![article_id], |row| {
        Ok(Article {
            article_id: row.get(0)?,
            price: row.get(1)?,
            manufacturer: row.get(2)?,
            stock: row.get(3)?,
            category: row.get(4)?,
        })
    })?;

    let article = article_iter
        .map(|x| x.unwrap())
        .next()
        .ok_or_else(|| rusqlite::Error::QueryReturnedNoRows)?;

    Ok(article)
}

fn check_article_existence(conn: &rusqlite::Connection, article_id: i32) -> bool {
    search_article(conn, article_id).is_ok()
}

pub fn get_all_article(conn: &rusqlite::Connection) -> rusqlite::Result<Vec<Article>> {
    let mut stmt = conn.prepare(
        "SELECT article_id, price, manufacturer, stock, category FROM article",
    )?;
    let article_iter = stmt.query_map([], |row| {
        Ok(Article {
            article_id: row.get(0)?,
            price: row.get(1)?,
            manufacturer: row.get(2)?,
            stock: row.get(3)?,
            category: row.get(4)?,
        })
    })?;

    let mut article_list = Vec::new();
    for article in article_iter {
        article_list.push(article?);
    }

    Ok(article_list)
}

// Hilfsfunktion zum Erstellen der Tabelle
pub fn create_table(conn: &rusqlite::Connection) -> rusqlite::Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS article (
            id             INTEGER PRIMARY KEY,
            article_id  INTEGER NOT NULL,
            price          REAL NOT NULL,
            manufacturer     TEXT NOT NULL,
            stock          INTEGER NOT NULL, 
            category       TEXT
        )",
        [],
    )?;
    Ok(())
}

pub fn insert_article(conn: &rusqlite::Connection, article: Article) -> rusqlite::Result<()> {
    if check_article_existence(conn, article.article_id) {
        return Err(rusqlite::Error::ToSqlConversionFailure(Box::new(
            std::io::Error::new(
                std::io::ErrorKind::InvalidInput,
                format!("Artikelnummer {} bereits vorhanden", article.article_id).to_string(),
            ),
        )));
    }
    conn.execute(
        "INSERT INTO article (article_id, price, manufacturer, stock, category) 
        VALUES (?1, ?2, ?3, ?4, ?5)",
        params![
            article.article_id,
            article.price,
            article.manufacturer,
            article.stock,
            article.category,
        ],
    )?;
    Ok(())
}

pub fn delete_article(conn: &rusqlite::Connection, article_id: Option<i32>) -> rusqlite::Result<()> {
    match article_id {
        Some(id) => {
            conn.execute("DELETE FROM article WHERE article_id = ?1", params![id])?;
        },
        None => {
            conn.execute("DELETE FROM article", params![])?;
        }
    }
    Ok(())
}
