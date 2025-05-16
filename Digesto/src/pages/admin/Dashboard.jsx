import { useAuth } from '../../context/useAuth';
function Dashboard() {
    const { auth } = useAuth();

    if ( auth.loading ) {
        return <div>Cargando...</div>;
        }

    return (

        <div className="container flex flex-col">
            <h1>Dashboard</h1>
            <div className="mt-4">
                <p>Welcome to the Digesto Dashboard!</p>
                { auth.user && <p>User: {auth.user.nombre}</p>}
                <p>Here you can manage your documents, users, and more.</p>
                <p>Click on the menu items to navigate around the dashboard.</p>
            </div>
        </div>
    );
}

 
export default Dashboard;