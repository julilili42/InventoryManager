//routes.rs
use crate::api::endpoint::{
    handle_create_record, handle_delete_record, handle_fetch_records, handle_generate_pdf,
    handle_import_csv, handle_update_record,
};
use crate::core::types::{Article, Customer};
use axum::{
    routing::{delete, get, post, put},
    Router,
};


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
        .route("/articles/pdf_gen", post(handle_generate_pdf))
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
}

pub fn get_routes() -> Router {
    Router::new()
        .nest("/api", article_routes())
        .nest("/api", customer_routes())
}
