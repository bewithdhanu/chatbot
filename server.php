<?php
define("INVALID_DATA", "Sorry !, I can't understand.");
define("MISUSE", "Your trying to misusing me,so i can't replay you");

if(isset($_POST)){
	if($_POST["function"] != ""){
		$fn=$_POST["function"];
		switch ($fn) {
			case 'init':
				echo init();
				break;
			
			case 'request':
				echo request($_POST);
				break;
			
			default:
				# code...
				break;
		}
	}
}
function init(){
	return json_encode(array("response"=>"Hello, Welcome to Chat Botz :)","action"=>""));
}
function request($data){
	if(isset($data["data"])){
		$message=$data["data"];
		$ret=parseMessage($message);

	}else{
		$ret["response"]=INVALID_DATA;
		$ret["action"]="";
	}
	return json_encode(array("response"=>$ret["response"],"action"=>$ret["action"]));
}
function parseMessage($message){
	if(strpos($message, 'name') !== false){
		$strings=array("I am dhanu.","My name is dhanu.","People call me dhanu.","You can call me dhanu.");
		$str=$strings[array_rand($strings)];
		$action="";
	}elseif(strpos($message, 'clear all messages') !== false||strpos($message, 'clear messages') !== false||strpos($message, 'clear all') !== false||strpos($message, 'clear') !== false){
		$str="OK, Now am clearing all our chat history!";
		$action="c";
	}else{
		$str=INVALID_DATA;
		$action="";
	}
	return array("response"=>$str,"action"=>$action);
}
?>