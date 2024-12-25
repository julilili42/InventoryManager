// traits.rs
use rusqlite::Connection;

/// Mapping of database row to a type
pub trait Mappable {
    fn from_row(row: &rusqlite::Row) -> rusqlite::Result<Self>
    where
        Self: Sized;
}

/// Allows searching for an record in the database by ID
pub trait Searchable {
    fn search(conn: &rusqlite::Connection, id: i32) -> rusqlite::Result<Self>
    where
        Self: Sized;
}

/// Insertion of an items into the database
pub trait Insertable {
    fn table_name() -> &'static str;
    fn columns() -> Vec<&'static str>;
    fn id_column() -> &'static str;
    fn id_value(&self) -> i32;

    // Returns all values for specific type
    fn values(&self) -> Vec<rusqlite::types::ToSqlOutput<'_>>;

    // Checks for duplicates in db 
    fn check_duplicate(conn: &Connection, id_value: i32) -> bool {
        let query = format!(
            "SELECT EXISTS(SELECT 1 FROM {} WHERE {} = ?1)",
            Self::table_name(),
            Self::id_column()
        );

        conn.query_row(&query, [id_value], |row| row.get::<_, i32>(0))
            .unwrap_or(0)
            != 0
    }
}
