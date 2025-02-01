// statistics.rs
use std::collections::HashMap;

pub fn article_order_count(
    conn: &rusqlite::Connection,
) -> rusqlite::Result<HashMap<i32, i32>> {
    let mut stmt = conn.prepare(
    "SELECT article_id, SUM(quantity) AS anzahl_artikel
          FROM order_article
          GROUP BY article_id
          ",
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
