//routes.rs
use crate::api::endpoint::{
    handle_create_record, handle_delete_record, handle_fetch_records, handle_generate_pdf,
    handle_import_csv, handle_search, handle_update_record,
};

use crate::core::types::{Article, Customer, Order};
use axum::{
    routing::{delete, get, post, put},
    Router,
};

use super::endpoint::handle_statistics;

pub fn operation_routes() -> Router {
    Router::new()
        .route("/operations/pdf", post(handle_generate_pdf))
        .route("/operations/statistics", get(handle_statistics))
}

pub fn article_routes() -> Router {
    Router::new()
        .route("/articles", get(handle_fetch_records::<Article>))
        .route("/articles/add", post(handle_create_record::<Article>))
        .route("/articles/delete", delete(handle_delete_record::<Article>))
        .route(
            "/articles/delete/:id",
            delete(handle_delete_record::<Article>),
        )
        .route("/articles/update", put(handle_update_record::<Article>))
        .route("/articles/import_csv", post(handle_import_csv))
        .route("/articles/search/:id", get(handle_search::<Article>))
}

pub fn customer_routes() -> Router {
    Router::new()
        .route("/customers", get(handle_fetch_records::<Customer>))
        .route("/customers/add", post(handle_create_record::<Customer>))
        .route(
            "/customers/delete",
            delete(handle_delete_record::<Customer>),
        )
        .route(
            "/customers/delete/:id",
            delete(handle_delete_record::<Customer>),
        )
        .route("/customers/update", put(handle_update_record::<Customer>))
        .route("/customers/search/:id", get(handle_search::<Customer>))
}

pub fn order_routes() -> Router {
    Router::new()
        .route("/orders", get(handle_fetch_records::<Order>))
        .route("/orders/add", post(handle_create_record::<Order>))
        .route("/orders/delete", delete(handle_delete_record::<Order>))
        .route("/orders/delete/:id", delete(handle_delete_record::<Order>))
        .route("/orders/update", put(handle_update_record::<Order>))
        .route("/orders/search/:id", get(handle_search::<Order>))
}

pub fn get_routes() -> Router {
    Router::new()
        .nest("/api", operation_routes())
        .nest("/api", article_routes())
        .nest("/api", customer_routes())
        .nest("/api", order_routes())
}
