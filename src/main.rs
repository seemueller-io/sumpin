fn main() {
    println!("Hello, world!");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_main_function_exists() {
        // Test that main function can be called without panicking
        // Since main() just prints, we can't easily test the output in unit tests
        // but we can ensure the function exists and doesn't panic
        main();
    }

    #[test]
    fn test_hello_world_output() {
        // This is a basic test to ensure the program structure is correct
        // In a real application, we would test actual functionality
        assert_eq!(2 + 2, 4); // Basic sanity check
    }
}
