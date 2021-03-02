use std::io; //import statement

fn main() {
    println!("Guess the number!");
    println!("Please input your guess:");
    
    // let : variable declaration
    // let : just as it is, will be consider as constant, not allowing any change in future.
    // let mut : mutable content -> *
    // = : assign to
    // :: : Associated Function of an object
    // new() : new object / allocation / pointer inicialization
    let mut guess = String::new();

    // &mut : pointer refference to be written inside read_line method.
    io::stdin().read_line(&mut guess).expect("Failed to read line!");
    println!("You guessed: {}", guess);
    // https://doc.rust-lang.org/book/ch02-00-guessing-game-tutorial.html
}
