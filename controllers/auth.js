const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const db = mysql.createConnection({
    host: process.env.dbs_host,
    user: process.env.dbs_user,
    password: process.env.dbs_password,
    database: process.env.dbs
});

exports.login = async (req, res) => {
  console.log(req.body);
  
    try {
        var email = req.body.email ;
        var password = req.body.password ;
            
    db.query('SELECT * FROM portfolio WHERE Email = ?', [email], async ( error, results) => {
        console.log(results);
        

        if(!results || !(await bcrypt.compare(password, results[0].Password) ) ) {
            res.status(401).render('login', {
                message: 'Password is incorrect'
            });
        }
        else {
            const id = results[0].id;
            
            const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });

            console.log(" The token is:" + token);

            const cookieOptions = {
                expires: new Date(
                    Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                ),
                httpOnly: true
            }

            res.cookie('jwt', token, cookieOptions );
            res.status(200).redirect("/portfolio");

        }

    });
  } catch (error) {
      console.log(error);
  }

}


exports.register = (req, res) => {
    console.log(req.body);

    const {email, password, cpassword} = req.body;

    db.query('SELECT Email FROM portfolio WHERE Email = ?', [email], async (error, results) => {
        if(error)
        {
            console.log(error);
        }
        
        if(results.length > 0)
        {
            return res.render('login', {
                message: 'That email is used'
            });
        }

        else if (password != cpassword)
        {
            return res.render('login', {
                message: 'Password do not match'
            });
            
        }

        let hashed = await bcrypt.hash(password, 6);
        console.log(hashed);

        db.query('INSERT INTO portfolio SET ? ', {Email: email,Password: hashed}, (error, _result) => {
            if(error)
            {
                console.log(error);
            } else {
                console.log(results);
                return res.status(200).redirect("/details");
            }
        });

    });

    
}

exports.details = (req, res) => {
    console.log(req.body);

    const { fname, lname, user, contact, degree, skills, projects, home, current, pincode } = req.body;


        db.query('INSERT INTO portfolio SET ? ', {FirstName: fname, LastName: lname, Username: user, Contact: contact, Degree: degree, Skills: skills, Projects: projects, Home: home, Current: current, Pincode: pincode}, (error, _result) => {
            if(error)
            {
                console.log(error);
            } else {
                console.log(results);
                return res.status(200).redirect("/index");
            }
        });

    
}