// types.rs
use crate::core::operations::{fetch_order_items, find_record_by_id};
use crate::core::traits::{Insertable, Mappable, Searchable};
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::params;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

#[derive(Serialize, Deserialize, Debug)]
pub struct Article {
    pub article_id: i32,
    pub price: f64,
    pub manufacturer: String,
    pub stock: i32,
    pub category: Option<String>,
}

impl Mappable for Article {
    fn from_row(
        row: &rusqlite::Row,
        _conn: Option<&rusqlite::Connection>,
    ) -> rusqlite::Result<Self> {
        Ok(Article {
            article_id: row.get(0)?,
            price: row.get(1)?,
            manufacturer: row.get(2)?,
            stock: row.get(3)?,
            category: row.get(4)?,
        })
    }
}

impl Searchable for Article {
    fn search(conn: &rusqlite::Connection, id: i32) -> rusqlite::Result<Self>
    where
        Self: Sized,
    {
        find_record_by_id(conn, id)
    }
}

impl Insertable for Article {
    fn table_name() -> &'static str {
        "article"
    }
    fn columns() -> Vec<&'static str> {
        vec!["article_id", "price", "manufacturer", "stock", "category"]
    }
    fn id_column() -> &'static str {
        "article_id"
    }
    fn id_value(&self) -> i32 {
        self.article_id
    }

    fn values(&self) -> Vec<rusqlite::types::ToSqlOutput<'_>> {
        vec![
            self.article_id.into(),
            self.price.into(),
            self.manufacturer.clone().into(),
            self.stock.into(),
            match &self.category {
                Some(s) => s.as_str().into(),
                None => rusqlite::types::Null.into(),
            },
        ]
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Customer {
    pub customer_id: i32,
    pub first_name: String,
    pub last_name: String,
    pub street: String,
    pub location: String,
    pub zip_code: i32,
    pub email: String,
}

 
impl Mappable for Customer {
    fn from_row(
        row: &rusqlite::Row,
        _conn: Option<&rusqlite::Connection>,
    ) -> rusqlite::Result<Self> {
        Ok(Customer {
            customer_id: row.get(0)?,
            first_name: row.get(1)?,
            last_name: row.get(2)?,
            street: row.get(3)?,
            location: row.get(4)?,
            zip_code: row.get(5)?,
            email: row.get(6)?,
        })
    }
}

impl Insertable for Customer {
    fn table_name() -> &'static str {
        "customer"
    }
    fn columns() -> Vec<&'static str> {
        vec![
            "customer_id",
            "first_name",
            "last_name",
            "street",
            "location",
            "zip_code",
            "email",
        ]
    }
    fn id_column() -> &'static str {
        "customer_id"
    }

    fn id_value(&self) -> i32 {
        self.customer_id
    }

    fn values(&self) -> Vec<rusqlite::types::ToSqlOutput<'_>> {
        vec![
            self.customer_id.into(),
            self.first_name.clone().into(),
            self.last_name.clone().into(),
            self.street.clone().into(),
            self.location.clone().into(),
            self.zip_code.into(),
            self.email.clone().into(),
        ]
    }
}

impl Searchable for Customer {
    fn search(conn: &rusqlite::Connection, id: i32) -> rusqlite::Result<Self>
    where
        Self: Sized,
    {
        find_record_by_id(conn, id)
    }
}


#[derive(Serialize, Deserialize, Debug)]
pub struct OrderItem {
    article: Article,
    quantity: i32,
}

impl OrderItem {
    pub fn new(article: Article, quantity: i32) -> Self {
        OrderItem {
            article, 
            quantity
        }
    }
}


#[derive(Serialize, Deserialize, Debug)]
pub struct Order {
    pub order_id: i32,
    pub customer: Customer,
    pub items: Vec<OrderItem>,
}

impl Order {
    pub fn new(order_id: i32, customer: Customer, items: Vec<OrderItem>) -> Self {
        Order {
            order_id, 
            customer,
            items
        }
    }
}

impl Mappable for Order {
    fn from_row(
        row: &rusqlite::Row,
        conn: Option<&rusqlite::Connection>,
    ) -> rusqlite::Result<Self> {
        let order_id = row.get(0)?;
        let fetched_order_items = match conn {
            Some(conn) => fetch_order_items(conn, order_id)?,
            None => {
                return Err(rusqlite::Error::InvalidParameterName(String::from(
                    "Connection is None",
                )))
            }
        };

        let customer_id = row.get(1)?;
        let fetched_customer = match conn {
            Some(conn) => find_record_by_id::<Customer>(conn, customer_id)?,
            None => {
                return Err(rusqlite::Error::InvalidParameterName(String::from(
                    "Connection is None",
                )))
            }
        };

        Ok(Order::new(order_id, fetched_customer, fetched_order_items))
    }
}

impl Insertable for Order {
    fn table_name() -> &'static str {
        "orders"
    }
    fn columns() -> Vec<&'static str> {
        vec!["order_id", "customer_id"]
    }
    fn id_column() -> &'static str {
        "order_id"
    }

    fn id_value(&self) -> i32 {
        self.order_id
    }

    fn values(&self) -> Vec<rusqlite::types::ToSqlOutput<'_>> {
        vec![self.order_id.into(), self.customer.customer_id.into()]
    }

    fn post_insert(&self, conn: &rusqlite::Connection) -> rusqlite::Result<()> {
        let query = "
            INSERT INTO order_article (order_id, article_id, quantity)
            VALUES (?1, ?2, ?3)
        ";

        let mut stmt = conn.prepare(query)?;

        for order_item in &self.items {
            stmt.execute(params![self.order_id, order_item.article.article_id, order_item.quantity])?;
        }

        Ok(())
    }

    fn post_delete(id_value: Option<&i32>, conn: &rusqlite::Connection) -> rusqlite::Result<()> {
        
        match id_value {
            Some(id_value) => {
                let query = "DELETE FROM order_article WHERE order_id = ?1";

                conn.execute(query, params![id_value])?;   
            }
            None => {
                let query = "DELETE FROM order_article";

                conn.execute(query, params![])?;
            }
        }

        
        Ok(())
    }

}

impl Searchable for Order {
    fn search(conn: &rusqlite::Connection, id: i32) -> rusqlite::Result<Self>
    where
        Self: Sized,
    {
        find_record_by_id(conn, id)
    }
}

#[derive(Deserialize, Serialize)]
pub struct PdfRequest {
    pub articles: Article,
    pub customer: Customer,
}

pub type DbPool = Arc<r2d2::Pool<SqliteConnectionManager>>;
