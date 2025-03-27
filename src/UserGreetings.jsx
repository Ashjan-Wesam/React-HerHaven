function UserGreetings(props){

        if(props.isLoggedIn){

            return <h2>welcome {props.userName}</h2>
        }
        else{
            return <h2>Please login</h2>
        }
    

}