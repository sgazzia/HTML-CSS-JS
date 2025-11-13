function obtenerCarrito() {
    const carritoJSON = localStorage.getItem('cinepolis-carrito');
    return carritoJSON ? JSON.parse(carritoJSON) : [];
}

function guardarCarrito(carrito) {
    localStorage.setItem('cinepolis-carrito', JSON.stringify(carrito));
}

function agregarProducto(nombre, precio, redirigir) {
    const carrito = obtenerCarrito();
    const nombreNormalizado = nombre.trim();
    
    const productoExistente = carrito.find(item => item.nombre === nombreNormalizado);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ nombre: nombreNormalizado, precio, cantidad: 1 });
    }

    guardarCarrito(carrito);
    
    if (redirigir) {
        window.location.href = 'carrito.html';
    }
}

function eliminarProducto(nombre) {
    let carrito = obtenerCarrito();
    const index = carrito.findIndex(item => item.nombre === nombre);

    if (index !== -1) {
        if (carrito[index].cantidad > 1) {
            carrito[index].cantidad--;
        } else {
            carrito.splice(index, 1);
        }
    }

    guardarCarrito(carrito);
    if (document.getElementById('lista-carrito')) {
        renderizarCarrito();
    }
}

function renderizarCarrito() {
    const carrito = obtenerCarrito();
    const listaCarrito = document.getElementById('lista-carrito');
    const totalElement = document.getElementById('total-compra');
    const totalContainer = totalElement ? totalElement.closest('.total-container') : null;
    let total = 0;

    if (!listaCarrito || !totalElement || !totalContainer) return;

    listaCarrito.innerHTML = ''; 

    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<li style="justify-content: center; color: #555; background-color: #eee; border-left: 5px solid #ccc;">El carrito está vacío. ¡Te esperamos en la cartelera!</li>';
        totalElement.textContent = '$0';
        totalContainer.classList.add('carrito-vacio-total');
        document.querySelector('.btn-comprar').disabled = true;
        return;
    }
    
    totalContainer.classList.remove('carrito-vacio-total');
    document.querySelector('.btn-comprar').disabled = false;


    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const li = document.createElement('li');
        li.innerHTML = `
            <div class="item-info">
                <strong>${item.nombre}</strong> <span class="precio-unitario">($${item.precio.toLocaleString('es-AR')} c/u)</span>
            </div>
            <div class="item-acciones">
                <div class="cantidad-control">
                    <button onclick="disminuirCantidad('${item.nombre}')" class="boton-accion-chico">-</button>
                    <span class="cantidad-numero">${item.cantidad}</span>
                    <button onclick="aumentarCantidad('${item.nombre}')" class="boton-accion-chico">+</button>
                </div>
                <span class="item-subtotal">$${subtotal.toLocaleString('es-AR')}</span>
                <button onclick="eliminarTodoProducto('${item.nombre}')" class="boton-eliminar-todo">X</button>
            </div>
        `;
        listaCarrito.appendChild(li);
    });

    totalElement.textContent = `$${total.toLocaleString('es-AR')}`;
}

function aumentarCantidad(nombre) {
    const carrito = obtenerCarrito();
    const producto = carrito.find(item => item.nombre === nombre);
    if (producto) {
        agregarProducto(nombre, producto.precio, false); 
        renderizarCarrito();
    }
}

function disminuirCantidad(nombre) {
    eliminarProducto(nombre);
    renderizarCarrito();
}

function eliminarTodoProducto(nombre) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => item.nombre !== nombre); 
    guardarCarrito(carrito);
    renderizarCarrito();
}

function cerrarModal() {
    document.getElementById('form-modal').style.display = 'none';
}

function finalizarCompra() {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }
    
    const detalle = carrito.map(item => 
        `${item.nombre} x ${item.cantidad} ($${(item.precio * item.cantidad).toLocaleString('es-AR')})`
    ).join(' | ');

    const total = document.getElementById('total-compra').textContent;
    const detalleElement = document.getElementById('detalle-pedido');
    if (detalleElement) {
        detalleElement.value = `Total: ${total} | Productos: ${detalle}`;
    }

    const modal = document.getElementById('form-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// =========================================================
// FUNCIÓN DE LOGIN (AÑADIDA)
// =========================================================

function validarLogin(event) {
    event.preventDefault(); 

    const usuario = document.getElementById('login-usuario').value.trim();
    const contrasena = document.getElementById('login-contrasena').value.trim();
    
    const USUARIO_CORRECTO = "admin";
    const CONTRASENA_CORRECTA = "blabla3933";
    
    if (usuario === USUARIO_CORRECTO && contrasena === CONTRASENA_CORRECTA) {
        
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('contenido-principal').style.display = 'block';
        
        alert("¡Bienvenido, " + usuario + "! Acceso concedido.");

        return true; 
        
    } else {
        
        alert("Error de acceso: Usuario o Contraseña incorrectos.");
        
        document.getElementById('login-contrasena').value = '';
        
        return false;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // LÓGICA DEL CARRITO (Código existente)
    // ----------------------------------------------------
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('boton-compra')) {
            e.preventDefault();

            const card = e.target.closest('.pelicula-card');

            if (card) {
                const nombreElement = card.querySelector('h3');
                let nombre = 'Producto Cinepolis';
                let precio = 5000; 

                if (nombreElement) {
                    nombre = nombreElement.textContent.trim();
                }

                if (card.closest('#cartelera')) {
                    precio = 5000;
                } else if (card.closest('#confiteria')) {
                    if (nombre.includes('Popcorn XL')) precio = 6000;
                    else if (nombre.includes('Nachos')) precio = 4000;
                    else if (nombre.includes('Coca-Cola')) precio = 1500;
                    else precio = 3000; 
                }
                
                agregarProducto(nombre, precio, true); 
            }
        }
    });

    
    if (document.getElementById('lista-carrito')) {
        renderizarCarrito();
    }
    
    
    const form = document.getElementById("checkout-form");
    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            
            const response = await fetch(form.action, {
                method: form.method,
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                localStorage.removeItem('cinepolis-carrito');
                cerrarModal();
                alert("¡Pedido enviado con éxito! Revisa tu correo para confirmar tu compra..");
                alert("¡Gracias por comprar en CinePolis! Esperamos verte pronto.");
                window.location.href = 'index.html';
            } else {
                alert("Hubo un error al enviar tu pedido. Por favor, inténtalo de nuevo.");
            }
        });
    }

    // ----------------------------------------------------
    // LÓGICA DEL LOGIN (Código nuevo/integrado)
    // ----------------------------------------------------
    const formularioLogin = document.getElementById('form-login');
    if (formularioLogin) {
        
        formularioLogin.addEventListener('submit', validarLogin);
    }
});