const STORAGE_KEY = "contactos";

let form = document.getElementById("formulario");
let inputNombre = document.getElementById("nombre");
let inputEmail = document.getElementById("email");
let mensaje = document.getElementById("mensaje");
let lista = document.getElementById("lista");

let contactos = cargarDeStorage();

function cargarDeStorage() {
    try{
        let datos = localStorage.getItem(STORAGE_KEY);
        let registros = datos ? JSON.parse(datos) : [];

        if (!Array.isArray(registros)){
            return [];
        }

        return registros.filter(contacto =>
            contacto !== null &&
            typeof contacto === "object" &&
            !Array.isArray(contacto) &&
            (typeof contacto.id === "number" || 
            typeof contacto.id === "string") &&
            typeof contacto.nombre === "string" &&
            contacto.nombre.trim().length >= 2 &&
            typeof contacto.email === "string" &&
            /^\S+@\S+\.\S+$/.test(contacto.email.trim())
        );
    } catch (error){
        console.error("error al leer el localStorage",error);
        return [];
    }
}

//Guardamos el arreglo en el localStorage
function guardarEnStorage(){
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(contactos)
        );
    } catch (error){
        console.error("error al guardar",error);
        mensaje.textContent = "No se pudieron guardar los datos";        
    }
}

//Validamos los datos
function validar(nombre, email){
    if (nombre.trim().length < 2){
        return "El nombre debe tener al menos 2 caracteres.";
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())){
        return "El email no es valido.";
    }

    let emailExiste = contactos.some(contacto =>
        contacto.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (emailExiste){
        return "Este email ya esta registrado";
    }

    return null;
}

function render(){
    lista.replaceChildren();

    contactos.forEach(contacto => {
        let tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta");

        let nombre = document.createElement("h3");
        nombre.textContent = contacto.nombre;

        let email = document.createElement("p");
        email.textContent = contacto.email;

        let botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Elliminar";
        botonEliminar.dataset.id = contacto.id;
        botonEliminar.type = "button";

        tarjeta.appendChild(nombre);
        tarjeta.appendChild(email);
        tarjeta.appendChild(botonEliminar);

        lista.appendChild(tarjeta);
    });
}

//Manejo del envio del formulario
form.addEventListener("submit",function(e){
    e.preventDefault();

    let nombre = inputNombre.value.trim();
    let email = inputEmail.value.trim();

    let error = validar(nombre, email);

    if (error){
        mensaje.textContent = error;
        return;
    }

    //Creo un objeto literal
    let nuevoContacto = {
        id: Date.now(),
        nombre: nombre,
        email: email
    };

    //agg al arreglo
    contactos.push(nuevoContacto);

    //sincronizo ocn localStorage
    guardarEnStorage();

    render();

    form.reset();
    mensaje.textContent = "Contacto guardado correctamente.";
    inputNombre.focus();
});

lista.addEventListener("click", function(e){
    if (e.target.tagName !== "BUTTON"){
        return;
    }

    let id = Number(e.target.dataset.id);

    contactos = contactos.filter(contacto =>
        contacto.id !== id
    );

    guardarEnStorage();
    render();
});

render();