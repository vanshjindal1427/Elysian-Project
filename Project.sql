create database project;
use project;
create table users (email varchar(50) primary key, pwd varchar(25), utype varchar(15) , status int);
select * from users;
update users set status = 0 where email = "bce@gmail.com";
create table iprofile (picpath varchar(100), email varchar(50) primary key, iname varchar(50) , contact int , gender varchar(10) , dob date, address varchar(200), city varchar(15) , state varchar(15) , insta varchar(80), fb varchar(80), youtube varchar(80), field varchar(15), otherinfo varchar(400) );
select * from iprofile;