const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required to create an account'],
        unique: [true, 'Email already exists'],
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'],
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password Should be more then 6 character'],
        select: false
    },
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    return
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;