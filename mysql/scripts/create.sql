create table user
(
    user_id  int auto_increment,
    email    varchar(255) not null,
    username varchar(50)  not null,
    password char(64)     not null,
    primary key (user_id),
    unique (email),
    unique (username)
);

create table user_follow
(
    following_user int not null,
    followed_user  int not null,
    primary key (following_user, followed_user),
    foreign key (following_user) references user (user_id) on delete cascade,
    foreign key (followed_user) references user (user_id) on delete cascade,
    check(following_user <> followed_user)
);

create table journalist
(
    employee_id int,
    user_id     int,
    first_name  varchar(50) not null,
    last_name   varchar(50) not null,
    birthday    date        not null,
    primary key (employee_id),
    foreign key (user_id) references user (user_id) on delete set null
);

create table article
(
    article_id      int auto_increment,
    journalist_id   int,
    publish_time    timestamp default current_timestamp not null,
    title           varchar(255)                        not null,
    subtitle        varchar(750)                        not null,
    article_content text                                not null,
    primary key (article_id),
    foreign key (journalist_id) references journalist (employee_id) on delete set null
);

create table comment
(
    comment_id      int,
    article_id      int                                 not null,
    user_id         int,
    comment_content varchar(750)                        not null,
    comment_time    timestamp default current_timestamp not null on update current_timestamp,
    primary key (comment_id, article_id),
    foreign key (article_id) references article (article_id) on delete cascade,
    foreign key (user_id) references user (user_id) on delete set null
);
delimiter $$
create trigger trigger_comment_id
before insert
on comment
for each row
begin
    declare max_id int;
    select coalesce(max(comment.comment_id), 0) + 1 into max_id from comment
    where comment.article_id = new.article_id;
    set new.comment_id = max_id;
end$$
delimiter ;

create table category
(
    category_id int auto_increment,
    label       varchar(50)                 not null,
    color_code  varchar(6) default 'ffffff' not null,
    primary key (category_id)
);

create table article_category
(
    article_id  int not null,
    category_id int not null,
    primary key (article_id, category_id),
    foreign key (article_id) references article (article_id) on delete cascade,
    foreign key (category_id) references category (category_id) on delete cascade
);