document.addEventListener("DOMContentLoaded", () => {
    cargarBaseDatos() //creo una funcion para cargar 
if (localStorage.getItem('carrito')){
    compra = JSON.parse(localStorage.getItem('carrito'))
    completarCarrito()
}



})
//tomo el JSON
const cargarBaseDatos = async () => {
    try {
        const res = await fetch('baseDatos.json')
        const data = await res.json()
        console.log(data)
        completarProductos(data)
        detectarBotones(data)
    } catch (error) {
        console.log(error)
    }
}

const contendorProductos = document.querySelector('#contenedor-productos')
const completarProductos = (data) => {
    const template = document.querySelector('#template-productos').content
    const fragment = document.createDocumentFragment()
 
    data.forEach(producto => {
      
        template.querySelector('img').setAttribute('src', producto.thumbnailUrl)
        template.querySelector('h5').textContent = producto.title
        template.querySelector('p span').textContent = producto.precio
        template.querySelector('button').dataset.id = producto.id
        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    })
    contendorProductos.appendChild(fragment)
}

let compra = {}

const detectarBotones = (data) => {
    const botones = document.querySelectorAll('.card button')
//deberia sumar item al clickear
    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            /* sweetalet para avisar que se sumo un nuevo articulo al carrito */
           Swal.fire({
                    position: 'top-middle',
                    icon: 'success',
                    title: 'Agregaste un nuevo item al carrito!',
                    showConfirmButton: false,
                    timer: 1500
                  })
            const producto = data.find(item => item.id === parseInt(btn.dataset.id))
            producto.cantidad = 1

            if (compra.hasOwnProperty(producto.id)) {
                producto.cantidad = compra[producto.id].cantidad + 1

               
            }
            compra[producto.id] = { ...producto }
          
            completarCarrito()
        })
    })
}

const items = document.querySelector('#items')

const completarCarrito = () => {

  
    items.innerHTML = ''

    const template = document.querySelector('#template-carrito').content
    const fragment = document.createDocumentFragment()

    Object.values(compra).forEach(producto => {
       
        template.querySelector('th').textContent = producto.id
        template.querySelectorAll('td')[0].textContent = producto.title
        template.querySelectorAll('td')[1].textContent = producto.cantidad
        template.querySelector('span').textContent = producto.precio * producto.cantidad
        
        //botones
        template.querySelector('.btn-info').dataset.id = producto.id
        template.querySelector('.btn-danger').dataset.id = producto.id

        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)

    pintarFooter()
    accionBotones()

    localStorage.setItem('carrito', JSON.stringify(compra))

}

const footer = document.querySelector('#footer-carrito')
const pintarFooter = () => {

    footer.innerHTML = ''

    if (Object.keys(compra).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5"> Carrito de compra limpio</th>
        `
        return
    }

    const template = document.querySelector('#template-footer').content
    const fragment = document.createDocumentFragment()

    // sumar cantidad y sumar totales
    const nCantidad = Object.values(compra).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(compra).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)


    template.querySelectorAll('td')[0].textContent = nCantidad
    template.querySelector('span').textContent = nPrecio

    const clone = template.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)


    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        compra = {}
        completarCarrito()
    })

}

const accionBotones = () => {
    const botonesAgregar = document.querySelectorAll('#items .btn-info')
    const botonesEliminar = document.querySelectorAll('#items .btn-danger')

 

    botonesAgregar.forEach(btn => {
        btn.addEventListener('click', () => {
          
            


            const producto = compra[btn.dataset.id]
            producto.cantidad ++
            compra[btn.dataset.id] = { ...producto }
            completarCarrito()
        })
    })

    botonesEliminar.forEach(btn => {
        btn.addEventListener('click', () => {
           


            
            const producto = compra[btn.dataset.id]
            producto.cantidad--
            if (producto.cantidad === 0) {
                delete compra[btn.dataset.id]
            } else {
                compra[btn.dataset.id] = { ...producto }
            }
            completarCarrito()
        })
    })
}