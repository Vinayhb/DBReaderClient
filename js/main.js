var app = angular.module('myApp', []);
app.run(function($rootScope) {
  $rootScope.name = "Ari Lerner";
});
app.controller('MyController',['$scope','$http', function($scope,$http) {
  $scope.person = {
    name: "Try It"
  };
  $scope.queryString = "";
  $scope.keyspacedata ={
	name:"",
	Table:"",
	column:"",
	row:"",
	metadata:"",
	tabledata:""
};
$scope.sendPost = function() {
var dataToPost = {query:"SELECT keyspace_name FROM system.schema_keyspaces;"}; /* PostData*/
    //var queryParams = {params: {op: 'saveEmployee'}};/* Query Parameters*/
    $http.post("http://localhost:9000/getKeyspaces", dataToPost)
            .success(function(serverResponse, status) {
                // Updating the $scope postresponse variable to update theview
                $scope.keyspaces = serverResponse;
            });
}


$scope.connectToDB = function() {
var dataToPost = {  hostname:"127.0.0.1",  port:"9042"}; /* PostData*/
    //var queryParams = {params: {op: 'saveEmployee'}};/* Query Parameters*/
    $http.post("http://localhost:9000/connectToCassandra", dataToPost)
            .success(function(serverResponse, status) {
                // Updating the $scope postresponse variable to update theview
                $scope.person.name = serverResponse;
            });
}

$scope.createSchema = function() {
var dataToPost = {query:"CREATE KEYSPACE " + $scope.scehmaName +" WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 3 }"}; 
    //var queryParams = {params: {op: 'saveEmployee'}};/* Query Parameters*/
    $http.post("http://localhost:9000/createKeyspace", dataToPost)
            .success(function(serverResponse, status) {
                // Updating the $scope postresponse variable to update theview
                $scope.person.name = serverResponse;
            });
}

$scope.getKeyspaceSchema = function(keySpace) {
	$scope.keyspacedata.name = keySpace;
	$scope.keyspacedata.Table ="";
	$scope.keyspacedata.metadata = "";
var dataToPost = {query:"SELECT columnfamily_name FROM system.schema_columnfamilies WHERE keyspace_name = '"+$scope.keyspacedata.name+"';"}; /* PostData*/
    $http.post("http://localhost:9000/getTableSchema", dataToPost)
            .success(function(serverResponse, status) {
                // Updating the $scope postresponse variable to update theview
                $scope.columnfamilynames = serverResponse;

            });
}

$scope.deleteKeyspace = function() {
var dataToPost = {query:"DROP KEYSPACE "+ $scope.DropKeyspace +";"}; /* PostData*/
    $http.post("http://localhost:9000/deleteKeyspace", dataToPost)
            .success(function(serverResponse, status) {
                // Updating the $scope postresponse variable to update theview
                $scope.deleted = serverResponse;
            });
}

$scope.tableMetaData = function(tablename) {
	$scope.keyspacedata.Table = tablename;
	$scope.keyspacedata.metadata = "";
	$scope.keyspacedata.tabledata = "";
    $http.get("http://127.0.0.1:9000/keyspace/"+$scope.keyspacedata.name+"/table/" + tablename)
            .success(function(serverResponse, status) {
                // Updating the $scope postresponse variable to update theview
                $scope.keyspacedata.metadata = serverResponse;
            });
}

$scope.getTableData = function(tablename) {
	$scope.keyspacedata.Table = tablename;
	$scope.keyspacedata.tabledata = "";
	$scope.keyspacedata.metadata = "";
	$scope.query ="http://127.0.0.1:9000/keyspace/"+$scope.keyspacedata.name+"/table/" + tablename+"/row";
    $http.get("http://127.0.0.1:9000/keyspace/"+$scope.keyspacedata.name+"/table/" + tablename+"/row")
            .success(function(serverResponse, status) {
                // Updating the $scope postresponse variable to update theview
		$scope.temp=serverResponse;
                $scope.keyspacedata.tabledata = serverResponse;
            });
}
$scope.sendQuery = function() {
	var dataToPost = {query:$scope.queryString +";"}; /* PostData*/
	    $http.post("http://localhost:9000/getDataFromCassandra", dataToPost)
	            .success(function(serverResponse, status) {
	                // Updating the $scope postresponse variable to update theview
	                $scope.answerRows = serverResponse;
	            });
}

}]);


