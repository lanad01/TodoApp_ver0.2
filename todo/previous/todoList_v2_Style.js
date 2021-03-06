
import { StyleSheet } from "react-native"


export  const styles=StyleSheet.create({
    container : {
       width:340,
    },
    task:{
      justifyContent: 'center',
    },
    itemContainer : {
      flex:1,
      marginTop:10,
      backgroundColor:'white',
      borderRadius:7,
      marginRight:50,
      },
    listtext : {
      fontFamily:"BMJUA",
      color:"#191970",
      fontSize:20,
      width:'55%',
      marginLeft:8,
      marginTop:10
      },
    noTasktext : {
        alignSelf:'center',
        fontFamily:"BMJUA",
        color:"white",
        fontSize:32,
        width:200,
        marginLeft:27,
        marginTop:10
    },
    priorityText : {
        fontFamily:"BMJUA",
        color:"#191970",
        fontSize:20,
        width:85,
        marginLeft:3,
        marginTop:10
    },
    itemTaskContainer:{
        flexDirection:'row',
    },
    HighPriority:{
        flex:1,
        marginTop:10,
        backgroundColor:'#FFC0CB',
        borderRadius:7,
        shadowColor: "pink",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.43,
        shadowRadius: 9.51,
        elevation: 15,
    },
    addModal: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#191970',
      borderWidth: 5,
      borderColor: 'white',
      borderRadius: 30,
      width: 300,
      height:400,
      marginLeft: 25,
    },
    modalheader: {
      fontFamily: 'BMJUA',
      fontSize: 22,
      color: 'white',
      marginTop: 10,
    },
    addTaskContent: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#191970',
      marginTop: 12,
      flexDirection: 'row',
      marginLeft:10,
    },
    taskContentText: {
      color: 'white',
      fontFamily: 'BMJUA',
      fontSize: 20,
    },
    taskInput: {
      width: '55%',
      height: 35,
      backgroundColor: 'white',
      borderRadius: 7,
      marginLeft: 10,
    },
    picker: {
      width: 160,
      height: 50,
      backgroundColor: 'white',
      marginLeft: 5,
    },
    expButton: {
      fontFamily: 'BMJUA',
      fontSize: 17,
      color: 'white',
      borderWidth: 5,
      borderColor: 'white',
      borderRadius: 5,
      width: 65,
      height: 35,
      marginRight: 15,
    },
    expInput: {
      backgroundColor: 'white',
      marginLeft: 3,
      width: 170,
      height: 40,
      borderRadius: 5,
      fontFamily: 'BMJUA',
      fontSize: 14,
      color: '#191970',
      paddingLeft:12,
    },
    textInput: {
      marginTop: 20,
      marginBottom: 10,
      paddingHorizontal: 10,
      height: 60,
      borderRadius: 10,
      borderColor: 'white',
      borderWidth: 3,
      color: 'white',
      fontSize: 19,
    },
    opacity: {
      backgroundColor: 'white',
      marginTop: 0,
      borderStyle: 'dotted',
      borderWidth: 4,
      borderColor: 'white',
      width: 70,
      alignItems: 'center',
      marginLeft: 10,
    },
    showText: {
      marginTop: 10,
      fontSize: 25,
      color: 'white',
    },
    logoutBtn: {
      margin: 10,
    },
    opacity2 : {
      backgroundColor: 'white',
      marginBottom:10,
      borderStyle: 'dotted',
      borderWidth: 4,
      borderColor: 'white',
      width: 70,
      alignItems: 'center',
      marginLeft: 10,
      
    },
    regBtn:{
      fontFamily: 'BMJUA',
      fontSize: 17,
      color: '#191970',
      marginRight: 0
    },  
    btn: {
      alignItems: 'center',
      backgroundColor: 'white',
      width: 100,
      height: 40,
      borderRadius: 5,
      borderWidth: 5,
      marginBottom: 10,
    },
    btnTxt: {
      fontFamily: 'BMJUA',
      fontSize: 20,
      marginTop: 2,
    },
    exp : {
      fontFamily:"BMJUA",
      color:"#191970",
      fontSize:15,
      marginLeft:12,
      marginTop:10,
      marginBottom:5,
      paddingTop:10,
    },
    notComplete:{
      backgroundColor:'#191970',
      justifyContent:'center',
      alignSelf:'center',
      marginTop:5,
      marginLeft:10,
      height:30,
      width:50,
      borderRadius:5,
    },
    perforemd:{
      fontFamily: 'BMJUA',
      color: 'white',
      fontSize: 15,
      paddingRight:5,
      justifyContent:'center',
      alignSelf:'center',
    },
    complete:{
      backgroundColor:'#FFB6C1',
      justifyContent:'center',
      alignSelf:'center',
      marginTop:5,
      marginLeft:10,
      height:30,
      width:50,
      borderRadius:5,
      opacity:0.7,
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: 'red',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
  })