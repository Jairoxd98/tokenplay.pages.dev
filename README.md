# TOKENPLAY

## Descripción

TOKENPLAY es una DApp que permite a los usuarios comprar NFTs relacionados con licencias de videojuegos. Estos NFTs pueden ser juegos individuales con sus respectivas características y propietarios.

## Características

- Comprar NFTs relacionados con licencias de videojuegos
- Visualizar todos los NFTs disponibles para compra
- Ver NFTs que un usuario ha comprado
- Mercado secundario donde publicar y comprar los NFTs
- Funcionalidad para añadir nuevos NFTs (sólo administradores)
- Cambiar precios y regalías de NFTs (sólo administradores)

## Requisitos previos

- Node.js
- Angular
- Ionic
- Truffle
- Ganache
- Metamask

## Instalación

1. Clonar el repositorio
   ```
   git clone https://github.com/tu_usuario/TOKENPLAY.git
   ```
2. Navegar hasta el directorio del proyecto
   ```
   cd TOKENPLAY
   ```
3. Instalar dependencias
   ```
   npm install
   ```
4. Desplegamos el contrato inteligente
   ```
   truffle deploy
   ```
5. Iniciar la aplicación
   ```
   ng serve
   ```
Nota: comprobar que está correctamente configurado los archivos "truffle-config.js", la migración de truffle "1691403915_tokenplay.js" y "enviroment.ts", para el entorno en el que se vaya a probar

## Test
1. Entramos a la consola de truffle
   ```
   truffle console
   ```
2. Ejecutamos el test del SC TOKENPLAY.sol
   ```
   test test/testTOKENPLAY.js
   ```
3. Ejecutamos el test del SC TOKENPLAY.sol
   ```
   test test/testMarketplace.js
   ```

## Uso

### Conexión con Metamask

Para utilizar esta DApp, debes tener instalada la extensión Metamask en tu navegador y conectarla a la DApp.

### Realizar transacciones

1. Selecciona el NFT que deseas comprar.
2. Haz clic en "Comprar" y confirma la transacción en Metamask.

### Visualizar NFTs

En la página principal, puedes ver todos los NFTs disponibles para compra, y en el marketplace, está disponible el mercado secundario

## Tecnologías utilizadas

- Truffle
- Mocha.js
- Web3.js
- Angular
- Ionic
- Tailwind

## <strong>Link a la DAPP</strong>

https://tokenplay.pages.dev

## Créditos

Desarrollado por Jairo Celada Cebrián, Marc Franch Sole y Joan Jimenez Jané.
