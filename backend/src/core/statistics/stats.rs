// stats.rs
use rusqlite::{Connection, Result};
use crate::core::types::{ArticleStatistics, CustomerStatistics, OrderStatistics, Statistics};
use crate::core::statistics::statsop::{get_article_revenue, get_ordered_quantities, get_total_prices, get_total_orders_customer, get_total_revenue_customer, get_most_bought_item_customer};

pub fn get_statistics(conn: &Connection) -> Result<Statistics> {
    let article_statistics = get_article_statistics(conn);
    let order_statistics = get_order_statistics(conn);
    let customer_statistics = get_customer_statistics(conn);

    let statistics = Statistics::new(article_statistics?, order_statistics?, customer_statistics?);

    Ok(statistics)
}

fn get_article_statistics(conn: &Connection) -> Result<ArticleStatistics> {
    let ordered_quantities = get_ordered_quantities(conn);
    let article_revenue = get_article_revenue(conn);

    let article_statistics = ArticleStatistics::new(ordered_quantities?, article_revenue?);

    Ok(article_statistics)
}


fn get_order_statistics(conn: &Connection) -> Result<OrderStatistics> {
    let total_price = get_total_prices(conn);

    let order_statistics = OrderStatistics::new(total_price?);

    Ok(order_statistics)
}

fn get_customer_statistics(conn: &Connection) -> Result<CustomerStatistics> {
    let number_of_orders = get_total_orders_customer(conn);
    let total_revenue = get_total_revenue_customer(conn);
    let most_bought_item = get_most_bought_item_customer(conn);

    let customer_statistics = CustomerStatistics::new(number_of_orders?, total_revenue?, most_bought_item?);

    Ok(customer_statistics)
}





