// statsop.rs
use std::collections::HashMap;
use rusqlite::{Connection, Result};

pub fn get_ordered_quantities(conn: &Connection) -> Result<HashMap<i32, i32>> {
    let mut stmt = conn.prepare(
        "SELECT article_id, SUM(quantity) AS anzahl_artikel
          FROM order_article
          GROUP BY article_id",
    )?;

    let mut results: HashMap<i32, i32> = HashMap::new();

    let rows = stmt
        .query_map([], |row| Ok((row.get::<_, i32>(0)?, row.get::<_, i32>(1)?)))
        .unwrap();

    for row in rows {
        if let Ok((article_id, order_count)) = row {
            results.insert(article_id, order_count);
        }
    }

    Ok(results)
}

pub fn get_article_revenue(conn: &Connection) -> Result<HashMap<i32, f64>> {
    let mut stmt = conn.prepare(
        "SELECT a.article_id, SUM(a.price * oa.quantity) AS revenue
         FROM article a
         JOIN order_article oa ON a.article_id = oa.article_id
         GROUP BY a.article_id",
    )?;

    let mut revenue_map = HashMap::new();
    let rows = stmt.query_map([], |row| {
        let article_id: i32 = row.get(0)?;
        let revenue: f64 = row.get(1)?;
        Ok((article_id, revenue))
    })?;

    for row in rows {
        let (article_id, revenue) = row?;
        revenue_map.insert(article_id, revenue); 
    }

    Ok(revenue_map)
}



pub fn get_total_prices(conn: &Connection) -> Result<HashMap<i32, f64>> {
    let mut stmt = conn.prepare(
        "SELECT o.order_id, SUM(a.price * oa.quantity) AS total_price
         FROM orders o
         JOIN order_article oa ON o.order_id = oa.order_id
         JOIN article a ON a.article_id = oa.article_id
         GROUP BY o.order_id"
    )?;

    let mut totals = HashMap::new();
    let rows = stmt.query_map([], |row| {
        Ok((row.get::<_, i32>(0)?, row.get::<_, f64>(1)?))
    })?;

    for row in rows {
        let (order_id, total_price) = row?;
        totals.insert(order_id, total_price);
    }
    Ok(totals)
}