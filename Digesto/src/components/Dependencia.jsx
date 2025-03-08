import PropTypes from "prop-types";

function Dependencia({nombre}){
    return(
        <div className="card-xs flex-1/6  bg-[#1B5B98] w-25 shadow-lg border-blue-900 border-1 ">
            <figure >
            <img
            src="https://scontent.firj1-1.fna.fbcdn.net/v/t39.30808-6/471075368_988473086645323_6248816904898158674_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=MzAEWlqv0fsQ7kNvgFXin7g&_nc_oc=AdhWQ9utiV5kMG6hPBMKWGLA01jg0X9270GctGt0-eS7JkdXb9xKvIyBmtTZzJJT-1c&_nc_zt=23&_nc_ht=scontent.firj1-1.fna&_nc_gid=AI3e4X20wOMnJDD8nZItPf5&oh=00_AYBdWHDKYOuhpHwVaxAQoEPMfp4gniWfXw7jMSt0AsBNyg&oe=67CF9089"
            className="max-h-15 mt-2 mask"
          />
            </figure>
            <div className="card-body items-center p-0">
                <h2 className="card-title font-semibold text-base font-[Montserrat]">{nombre}</h2>
                <div className="card-actions justify-end">
                </div>
            </div>
        </div>
    )
}

Dependencia.propTypes = {
    nombre: PropTypes.string.isRequired
};

export default Dependencia;