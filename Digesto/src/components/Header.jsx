function Header (){
return(
    <>
   
    <nav className="px-4 py-4 sm:flex sm:items-center sm:justify-between">
      <section className="flex justify-between">
        <img src="https://scontent-eze1-1.xx.fbcdn.net/v/t39.30808-6/471075368_988473086645323_6248816904898158674_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=MzAEWlqv0fsQ7kNvgGNboRX&_nc_oc=AdipU06agcDxAgU6ItUaTsYJmicUXvwtI7-ZYHSkfN26G9heAdD5RbITkxobZE_F9f8&_nc_zt=23&_nc_ht=scontent-eze1-1.xx&_nc_gid=AXtqhxNtS-FEVaEJDYIPR46&oh=00_AYBwHw7Iar9barKr-ZY8a8kWBpeSH3Mchqjh-LDNYO5lNw&oe=67CEAF89" className="h-14"/>
        <button className="text-white sm:hidden">
        </button>
      </section>
      <div className="flex flex-col items-start mt-3 gap-2 sm:flex-row sm:m-0">
        <button className="text-white font-[Montserrat] hover:bg-gray-200 w-full font-bold text-left px-2 rounded hover:text-gray-900">Blog</button>
        <button className="text-white font-[Montserrat] hover:bg-gray-200 w-full font-bold text-left px-2 rounded hover:text-gray-900">Docs</button>
        <button className="text-white font-[Montserrat] hover:bg-gray-200 w-full font-bold text-left px-2 rounded hover:text-gray-900">Contacto</button>
      </div>
    </nav>
    </>
)
}

export default Header;