import { useAuth } from '../../context/useAuth';
function Dashboard() {
    const { auth } = useAuth();
    const user = auth.user

    console.log(user , auth);
    

    if ( auth.loading ) {
        return <div>Cargando...</div>;
        }

    return (

        <div className="container flex flex-col">
            <h1>Dashboard</h1>
            <div className="mt-4">
                <p>Welcome to the Digesto Dashboard!</p>
                {Object.keys(user).map(key => (
                    <p key={key}>{key}: {user[key]}</p>
                    ))}
                <p>Here you can manage your documents, users, and more.</p>
                <p>Click on the menu items to navigate around the dashboard.</p>
            </div>
        </div>
    );
}

 
export default Dashboard;