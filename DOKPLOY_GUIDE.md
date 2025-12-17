# Guía de Despliegue en Dokploy - Gestión Hogar Frontend

Para desplegar este proyecto en Dokploy, sigue estos pasos para configurar las variables de entorno.

## Variables de Entorno

Debes configurar las siguientes variables en la sección de **Environment Variables** de tu aplicación en Dokploy:

### Variables de Construcción (Build Arguments)
Estas variables son necesarias durante el proceso de `docker build` porque Next.js las utiliza para inyectar valores en el código del lado del cliente.

| Variable | Valor Recomendado | Descripción |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_BACKEND_URL` | `https://ghogar-api-dev.digitalizartstudio.com/` | URL de la API accesible desde el navegador. |
| `INTERNAL_BACKEND_URL` | `https://ghogar-api-dev.digitalizartstudio.com/` | URL de la API para llamadas desde el servidor (SSR). |

> [!IMPORTANT]
> En Dokploy, asegúrate de marcar estas variables como **Build Arguments** si el panel lo permite, o simplemente agrégalas como variables de entorno normales. El `Dockerfile` las capturará como `ARG`.

### Variables de Ejecución (Runtime)
| Variable | Valor | Descripción |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Indica que la aplicación corre en producción. |
| `PORT` | `3000` | El puerto en el que escucha la aplicación (Dokploy suele mapear el 3000 por defecto). |

## Pasos en Dokploy

1. **Crear Aplicación**: Selecciona tu repositorio de GitHub.
2. **Configuración de Docker**:
   - **Dockerfile Path**: `Dockerfile` (en la raíz del proyecto).
3. **Variables**: Agrega las variables `NEXT_PUBLIC_BACKEND_URL` y `INTERNAL_BACKEND_URL` con los valores de desarrollo proporcionados.
4. **Desplegar**: Haz clic en el botón de despliegue.

El proyecto está configurado para usar el modo `standalone` de Next.js, lo que resulta en una imagen de Docker mucho más pequeña y optimizada.
