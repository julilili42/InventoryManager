use axum::{
    extract::Json,
    http::{HeaderMap, HeaderValue, StatusCode},
    response::{IntoResponse, Response},
};

use crate::core::types::Order;
use super::html::get_html;

use headless_chrome::Browser;
use urlencoding::encode;



pub async fn fetch_pdf(Json(order): Json<Order>) -> Response {    
    let pdf_data: Vec<u8> = match generate_pdf(&order) {
        Ok(data) => data,
        Err(e) => {
            eprintln!("Error while generating pdf: {}", e);
            return (StatusCode::INTERNAL_SERVER_ERROR, "Error while generating pdf").into_response();
        }
    };

    let mut headers = HeaderMap::new();
    headers.insert("Content-Type", HeaderValue::from_static("application/pdf"));
    headers.insert("Content-Disposition", HeaderValue::from_static("inline; filename=\"auftrag.pdf\""));

    (StatusCode::OK, headers, pdf_data).into_response()
}





fn generate_pdf(order: &Order) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
    let browser = Browser::default()?;
    let tab = browser.new_tab()?;

    let html = get_html(&order)?;

    let data_url = format!("data:text/html,{}", encode(&*html));
    tab.navigate_to(&data_url)?;
    tab.wait_until_navigated()?;

    let pdf_data = tab.print_to_pdf(None)?;
    
    Ok(pdf_data)
}