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


pub fn get_total_orders_customer(conn: &Connection) -> Result<HashMap<i32, i32>> {
    let mut stmt = conn.prepare(
        "SELECT customer_id, COUNT(order_id) AS order_count 
         FROM orders 
         GROUP BY customer_id"
    )?;

    let mut results = HashMap::new();

    let rows = stmt.query_map([], |row| {
        let customer_id: i32 = row.get(0)?;
        let order_count: i32 = row.get(1)?;
        Ok((customer_id, order_count))
    })?;

    for row in rows {
        let (customer_id, order_count) = row?;
        results.insert(customer_id, order_count);
    }

    Ok(results)
}



pub fn get_total_revenue_customer(conn: &Connection) -> Result<HashMap<i32, f64>> {
    let mut stmt = conn.prepare(
        "SELECT o.customer_id, COALESCE(SUM(a.price * oa.quantity), 0) AS total_revenue
         FROM orders o
         LEFT JOIN order_article oa ON o.order_id = oa.order_id
         LEFT JOIN article a ON oa.article_id = a.article_id
         GROUP BY o.customer_id"
    )?;

    let mut results = HashMap::new();

    let rows = stmt.query_map([], |row| {
        let customer_id: i32 = row.get(0)?;
        let total_revenue: f64 = row.get(1)?;
        Ok((customer_id, total_revenue))
    })?;

    for row in rows {
        let (customer_id, total_revenue) = row?;
        results.insert(customer_id, total_revenue);
    }

    Ok(results)
}


pub fn get_most_bought_item_customer(conn: &Connection) -> Result<HashMap<i32, String>> {
    let mut stmt = conn.prepare(
        "SELECT o.customer_id, a.name 
         FROM orders o
         JOIN order_article oa ON o.order_id = oa.order_id
         JOIN article a ON oa.article_id = a.article_id
         WHERE oa.quantity = (
             SELECT MAX(sub_oa.quantity) 
             FROM order_article sub_oa 
             WHERE sub_oa.order_id = o.order_id
         )"
    )?;

    let mut results = HashMap::new();

    let rows = stmt.query_map([], |row| {
        let customer_id: i32 = row.get(0)?;
        let article_name: String = row.get(1)?;
        Ok((customer_id, article_name))
    })?;

    for row in rows {
        let (customer_id, article_name) = row?;
        results.insert(customer_id, article_name);
    }

    Ok(results)
}
