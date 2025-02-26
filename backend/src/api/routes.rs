//routes.rs
use crate::api::endpoint::{
    handle_create_record, handle_fetch_records, handle_generate_pdf,
    handle_import_csv, handle_search, handle_update_record, handle_delete_record
};
use crate::api;

use crate::core::types::{ApiResponse, Article, ArticleStatistics, Customer, CustomerStatistics, Order, OrderItem, OrderStatistics, OrderStatus, OrderType, Statistics};
use axum::{
    routing::{delete, get, post, put},
    Router,
};
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

use super::endpoint::handle_statistics;


#[derive(OpenApi)]
#[openapi(
    tags(
        (name = "InventoryManager", description = "Documentation of the REST-API of InventoryManager.")
    ),
    components(schemas(Statistics, ApiResponse, Article, Customer, Order, OrderItem, OrderType, OrderStatus, CustomerStatistics, ArticleStatistics, OrderStatistics)),
    paths(
        api::endpoint::handle_search,
        api::endpoint::handle_fetch_records,
        api::endpoint::handle_create_record,
        api::endpoint::handle_update_record,
        api::endpoint::handle_statistics,
        api::endpoint::handle_generate_pdf,
        api::endpoint::handle_import_csv
    )
)]
pub struct ApiDoc;

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
        .route("/articles/import_csv", post(handle_import_csv::<Article>))
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
        .route("/customers/import_csv", post(handle_import_csv::<Customer>))
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
        .merge(SwaggerUi::new("/api/docs").url("/api-docs/openapi.json", ApiDoc::openapi()))
}
