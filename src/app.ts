import * as express from 'express';
import * as createError from 'http-errors';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as csrf from 'csurf';
import * as cookieParser from 'cookie-parser';

import indexRouter from './controller/index';
import newRouter from './controller/new';
import editRouter from './controller/edit';

const app = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(express.static(path.join(__dirname, './views/scripts')));
app.use(express.static(path.join(__dirname, './views/style/compiled')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Use ejs as view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set( 'trust proxy', true );

const csrfProtection = csrf({ cookie: true });
app.use(cookieParser())
//Routers
app.use('/', indexRouter);
app.use('/new', csrfProtection, newRouter);
app.use('/edit', csrfProtection, editRouter);

app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err:any, req: any, res: any, next: any) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Server setup
app.listen(port, () => {
    console.log(`App listening on: http://localhost:${port}/`);
});
