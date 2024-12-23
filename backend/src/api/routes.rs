//routes.rs
use crate::api::endpoint::{
    add_entry, delete_entry, get_data, import_csv, update_entry, pdf_gen
};
use axum::{
    routing::{delete, get, post, put},
    Router,
};
pub fn get_routes() -> Router {
    Router::new()
        .route("/api/data", get(get_data))
        .route("/api/add_entry", post(add_entry))
        .route("/api/delete_entry", delete(delete_entry))
        .route("/api/delete_entry/:article_id", delete(delete_entry))
        .route("/api/update_entry", put(update_entry))
        .route("/api/import_csv", post(import_csv))
        .route("/api/pdf_gen", post(pdf_gen))
}
