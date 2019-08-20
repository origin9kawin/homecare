import React from 'react'
import { SQLite } from 'expo-sqlite';
const db = SQLite.openDatabase("homecare.db");
class LocalSQlite extends React.Component {
  async statusTable(data) {
    try {
      await db.transaction(
        tx => {
          data.status.map((item) => {
            tx.executeSql("insert into status (ids, color, initState, name, desc, ordering, filterAble, selectAble, reasonBtn) \n" +
              "values (?, ?, ?, ?, ?, ?, ?, ?, ?)", [item.id, item.color, +item.initState, item.name, item.desc, item.ordering, +item.filterAble, +item.selectAble, +item.reasonBtn]);
          });
          data.project.map((item) => {
            tx.executeSql("insert into project (ids, name) \n" +
              "values (?, ?)", [item.id, item.name]);
          });
          data.cate.map((item) => {
            tx.executeSql("insert into cate (ids, name, slaDay) \n" +
              "values (?, ?, ?)", [item.id, item.name, item.slaDay]);
          });
          data.subcat.map((item) => {
            tx.executeSql("insert into subcat (ids, name, maincatId, slaDay) \n" +
              "values (?, ?, ?, ?)", [item.id, item.name, item.maincatId, item.slaDay]);
          });
          data.reason.map((item) => {
            tx.executeSql("insert into reason (ids, name, ordering) \n" +
              "values (?, ?, ?)", [item.id, item.name, item.ordering]);
          });
          data.imgmaintag.map((item) => {
            tx.executeSql("insert into imgmaintag (ids, name, ordering, selectAble) \n" +
              "values (?, ?, ?,? )", [item.id, item.name, item.ordering, item.selectAble]);
          });
          data.imgsubtag.map((item) => {
            tx.executeSql("insert into imgsubtag (ids, name, mainimgtagId, ordering, selectAble) \n" +
              "values (?, ?, ?, ?, ?)", [item.id, item.name, item.mainimgtagId, item.ordering, item.selectAble]);
          });
          data.technician.map((item) => {
            tx.executeSql("insert into technician (ids, firstname, email) \n" +
              "values (?, ?, ?)", [item.id, item.firstname, item.email]);
          });
          data.md5sum.map((item) => {
            tx.executeSql("insert into md5sum (name, value) \n" +
              "values (?, ?)", [item.name, item.value]);
          });
        },
      )
    } catch (error) {
      console.log(error);
    } finally {
      console.log("statusTable")
    }
  }
  async PreloadWrite(dataSource) {
    console.log("\nLocalSQLite->Write create database")
    // drop and recreate table
    await db.transaction(tx => {
      tx.executeSql("drop table status")
      tx.executeSql("drop table project")
      tx.executeSql("drop table cate")
      tx.executeSql("drop table subcat")
      tx.executeSql("drop table reason")
      tx.executeSql("drop table imgmaintag")
      tx.executeSql("drop table imgsubtag")
      tx.executeSql("drop table technician")
      tx.executeSql("drop table md5sum")
    })
    console.log("\nLocalSQLite->Write after drop: " + JSON.stringify(db))
    await db.transaction(tx => {
      tx.executeSql(
        "create table if not exists status \n" +
        "(id integer primary key not null, \n" +
        "ids text, color text, initState int, name text, desc text, ordering int, filterAble int, selectAble int, reasonBtn int);"
      );
      tx.executeSql(
        "create table if not exists project \n" +
        "(id integer primary key not null, \n" +
        "ids text, name text);"
      );
      tx.executeSql(
        "create table if not exists cate \n" +
        "(id integer primary key not null, \n" +
        "ids text, name text, slaDay int);"
      );
      tx.executeSql(
        "create table if not exists subcat \n" +
        "(id integer primary key not null, \n" +
        "ids text, name text, maincatId text, slaDay int);"
      );
      tx.executeSql(
        "create table if not exists reason \n" +
        "(id integer primary key not null, \n" +
        "ids text, name text, ordering int);"
      );
      tx.executeSql(
        "create table if not exists imgmaintag \n" +
        "(id integer primary key not null, \n" +
        "ids text, name text, ordering int, selectAble int);"
      );
      tx.executeSql(
        "create table if not exists imgsubtag \n" +
        "(id integer primary key not null, \n" +
        "ids text, name text, mainimgtagId text, ordering int, selectAble int);"
      );
      tx.executeSql(
        "create table if not exists technician \n" +
        "(id integer primary key not null, \n" +
        "ids text, firstname text, email text);"
      );
      tx.executeSql(
        "create table if not exists md5sum \n" +
        "(id integer primary key not null, \n" +
        "name text, value text);"
      );
      tx.executeSql(
        "create table if not exists sopImage \n" +
        "(id integer primary key not null, \n" +
        "mainids text, subids text, uri text);"
      );
    });
    console.log("\nLocalSQLite->Write")
    const statusdataSource = await dataSource;
    const statusResult = await this.statusTable(statusdataSource)
    console.log("finish write sqlite");
    return true
  }
}
const response = new LocalSQlite();
export default response;
