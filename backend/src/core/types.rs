// types.rs
use r2d2_sqlite::SqliteConnectionManager;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

// Idee:
// Article erweitern um Felder aus CSV-Export (description, ...)

#[derive(Serialize, Deserialize, Debug)]
pub struct Article {
    pub article_id: i32,
    pub price: f64,
    pub manufacturer: String,
    pub stock: i32,
    pub category: Option<String>,
    pub description: Option<String>,
    pub image: Option<String>,
}

pub type DbPool = Arc<r2d2::Pool<SqliteConnectionManager>>;
