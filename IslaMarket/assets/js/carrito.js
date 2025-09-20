// assets/js/carrito.js

class CarritoGlobal {
    constructor() {
        this.items = this.obtenerCarrito();
        this.observadores = [];
        this.inicializar();
    }

    inicializar() {
        // Escuchar cambios en localStorage para sincronizar entre pestañas
        window.addEventListener('storage', (e) => {
            if (e.key === 'islamarketCarrito') {
                this.items = this.obtenerCarrito();
                this.notificarCambio();
            }
        });
    }

    // Obtener carrito desde localStorage
    obtenerCarrito() {
        try {
            const carritoGuardado = localStorage.getItem('islamarketCarrito');
            return carritoGuardado ? JSON.parse(carritoGuardado) : [];
        } catch (error) {
            console.error("Error al parsear el carrito desde localStorage:", error);
            return [];
        }
    }

    // Guardar carrito en localStorage
    guardarCarrito() {
        try {
            localStorage.setItem('islamarketCarrito', JSON.stringify(this.items));
            // Notificar a otras instancias (pestañas) del mismo dominio
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('storage'));
            }
        } catch (error) {
            console.error("Error al guardar el carrito en localStorage:", error);
        }
    }

    // Agregar producto al carrito
    agregarProducto(id, cantidad = 1, datosProducto = null) {
        const itemExistenteIndex = this.items.findIndex(item => item.id === id);

        if (itemExistenteIndex > -1) {
            // Si el producto ya existe, actualizar la cantidad
            this.items[itemExistenteIndex].cantidad += cantidad;
        } else {
            // Si es un nuevo producto, agregarlo
            // Se espera que datosProducto contenga al menos { nombre, precio, imagen }
            if (!datosProducto) {
                console.error("Se requiere datosProducto para agregar un nuevo item al carrito.");
                return false;
            }
            this.items.push({
                id: id,
                nombre: datosProducto.nombre,
                precio: datosProducto.precio,
                imagen: datosProducto.imagen,
                cantidad: cantidad
            });
        }

        this.guardarCarrito();
        this.notificarCambio();
        return true;
    }

    // Actualizar cantidad de un producto
    actualizarCantidad(id, nuevaCantidad) {
        const itemIndex = this.items.findIndex(item => item.id === id);

        if (itemIndex > -1) {
            if (nuevaCantidad <= 0) {
                this.eliminarProducto(id);
            } else {
                this.items[itemIndex].cantidad = nuevaCantidad;
                this.guardarCarrito();
                this.notificarCambio();
            }
        }
    }

    // Eliminar producto del carrito
    eliminarProducto(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.guardarCarrito();
        this.notificarCambio();
    }

    // Obtener todos los items del carrito
    obtenerItems() {
        return [...this.items]; // Devolver copia para evitar modificaciones externas
    }

    // Calcular total del carrito
    calcularTotal() {
        return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0).toFixed(2);
    }

    // Obtener cantidad total de productos
    obtenerCantidadTotal() {
        return this.items.reduce((total, item) => total + item.cantidad, 0);
    }

    // Limpiar carrito
    limpiar() {
        this.items = [];
        this.guardarCarrito();
        this.notificarCambio();
    }

    // Suscribir observadores para actualizaciones
    suscribir(funcionCallback) {
        this.observadores.push(funcionCallback);
    }

    // Notificar a observadores sobre cambios
    notificarCambio() {
        this.observadores.forEach(callback => {
            if (typeof callback === 'function') {
                callback(this);
            }
        });
    }
}

// Crear una instancia global del carrito
const carritoGlobal = new CarritoGlobal();

// Hacerlo accesible globalmente si es necesario (opcional, para debugging)
// window.carritoGlobal = carritoGlobal;

// Exportar para uso en módulos (si se usa bundler)
// export default carritoGlobal;