const Member = require('../models/member');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = '12345-67890-09876-54321';

class AuthController {
    //Show login form
    showLoginForm(req, res) {
        res.render('login', { title: 'Login' });
    };

    //Show register form
    showRegisterForm(req, res) {
        res.render('register', { title: 'Register' });
    };

    //Register user
    register(req, res) {
        const { membername, password, name, YOB } = req.body;
        Member.findOne({ membername })
            .then(member => {
                if (member) {
                    return res.status(400).send('User already exists');
                }

                return bcrypt.hash(password, 10);
            })
            .then(hashedPassword => {
                const newMember = new Member({
                    membername,
                    password: hashedPassword,
                    name,
                    YOB
                });
                return newMember.save();
            })
            .then(() => {
                res.redirect('/auth/login');
            })
            .catch(err => {
                res.status(500).send('Server error');
            });
    }

    //Login 
    login(req, res) {
        const { membername, password } = req.body;
        Member.findOne({ membername })
            .then(member => {
                if (!member) {
                    return res.status(400).send('Incorrect username or password');
                }

                return bcrypt.compare(password, member.password)
                    .then(isMatch => {
                        if (!isMatch) {
                            return res.status(400).send('Incorrect username or password');
                        }
                        // Tạo JWT
                        const token = jwt.sign({
                            id: member._id,
                            membername: member.membername,
                            name: member.name,
                            YOB: member.YOB,
                            isAdmin: member.isAdmin
                        }, SECRET_KEY, { expiresIn: '1h' });
                        
                        req.session.token = token;
                        // res.send(`Token: ${token}`);
                        res.redirect('/');
                    });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Server error');
            });
    }

    //Logout
    logout(req, res) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    }

    //Show user's profile
    showProfile(req, res) {
        if (!req.user) {
            res.redirect('/');
        }
        res.render('users/profile.ejs', {
            title: 'Profile',
            user: req.user
        });
    }

    // Update user
    updateProfile(req, res) {
        const { name, YOB } = req.body;
        Member.findById(req.user.id)
            .then(member => {
                if (!member) {
                    return res.status(404).send('User not found');
                }
                member.name = name || member.name;
                member.YOB = YOB || member.YOB;
                return member.save();
            })
            .then(() => {
                res.redirect('/auth/profile');
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Server error');
            });
    }

    //Show change password form
    showChangePasswordForm(req, res) {
        if (!req.user) {
            res.redirect('/');
        }
        res.render('users/change-password', { title: 'Change Password' });
    }

    //Change password 
    changePassword(req, res) {
        const { currentPassword, newPassword, confirmNewPassword } = req.body;
        if (newPassword !== confirmNewPassword) {
            return res.status(400).send('New password does not match');
        }

        Member.findById(req.user.id)
            .then(member => {
                if (!member) {
                    return res.status(404).send('User not found');
                }

                return bcrypt.compare(currentPassword, member.password)
                    .then(isMatch => {
                        if (!isMatch) {
                            return res.status(400).send('Current password is incorrect');
                        }
                        return bcrypt.hash(newPassword, 10);
                    })
                    .then(hashedNewPassword => {
                        member.password = hashedNewPassword;
                        return member.save();
                    })
                    .then(() => {
                        res.redirect('/auth/profile');
                    });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Server error');
            });
    }
}


module.exports = new AuthController();
