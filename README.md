# Parking Management Frontend

Frontend profesional para un sistema de gestión de parqueadero, construido con Angular y conectado a una API REST en Laravel.

Su objetivo es operar flujos reales: ingreso/salida de vehículos, historial de tickets, panel administrativo y reportes.

---

## Qué resuelve

- Control operativo diario de entradas y salidas.
- Visualización de ocupación e ingresos.
- Gestión de catálogos (vehículos, estacionamientos, espacios).
- Reportes con filtros y exportación.
- Autenticación con token y rutas protegidas.

---

## Stack

- Angular 21 (standalone components)
- TypeScript
- RxJS
- Angular Material + Bootstrap
- ngx-echarts (dashboard)

Backend esperado:

- Laravel API (`/api`)
- Auth por Bearer token

---

## Arquitectura (simple y escalable)

```txt
src/app/
  core/        # auth, interceptors, guards, api client base
  shared/      # componentes reutilizables, servicios transversales, utilidades
  features/    # routing por dominio (auth, dashboard, tickets, vehicles, etc.)
  modules/     # implementación actual de pantallas por dominio (migración incremental)
```

### Principios aplicados

- Lógica de negocio en servicios/presenters, no en templates.
- Consumo HTTP centralizado (`ApiClient` + `BaseApiService`).
- Manejo global de auth y errores con interceptores.
- Lazy loading por dominio para mejorar escalabilidad.

---

## Flujos principales

- **Auth:** login, persistencia de sesión, logout y protección de rutas.
- **Tickets:** vista activa/historial, búsqueda, detalle, entrada/salida.
- **Dashboard:** métricas y gráficos de ocupación/ingresos.
- **Reportes:** filtros por rango/estado/placa y exportación.

---

## Ejecutar en local

### 1) Backend (Laravel)

Asegura que la API esté levantada y accesible. Ejemplo local:

- `http://localhost:8080/api`

### 2) Frontend

```bash
cd parking-management-frontend
npm install
npm start
```

App en:

- `http://localhost:4200`

---

## Configuración de entorno

Editar:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

Ajusta:

- `apiUrl`: URL base de la API Laravel
- `timezone`: zona horaria de la app

---

## Build de producción

```bash
npm run build
```

La salida se genera en `dist/`.

---

## Screenshots

Agrega aquí capturas reales del producto:

- Dashboard
- Lista de tickets
- Formulario de ingreso
- Reportes

---

## Enfoque de producto

Este proyecto está estructurado para escenarios reales de cliente:

- Código mantenible para equipos pequeños/medianos.
- Arquitectura incremental (evita reescrituras costosas).
- Base lista para extender con módulos como pagos, multi-sede y auditoría.

## Nota para portfolio

Este proyecto simula un sistema real de gestión de parqueaderos, con decisiones técnicas enfocadas en operación diaria, mantenibilidad y escalabilidad gradual para un contexto SaaS/freelance.
