class Token {
    constructor(id, email, secret, date) {
        this.id = id;
        this.email = email;
        this.secret = secret;
        this.date = date
    }
}

module.exports = Token;