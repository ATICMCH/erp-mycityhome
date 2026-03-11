# 🚀 Guía Simple: Crear Base de Datos en tu Servidor

## 📋 Información Rápida

**Servidor:** 185.252.233.57
**SSH:** `ssh -p 2269 hommy@185.252.233.57`
**Password:** Parkour123

---

## ⚡ MÉTODO RÁPIDO (Copia y Pega)

### Paso 1: Conectar al Servidor

```bash
ssh -p 2269 hommy@185.252.233.57
```
> Password: `Parkour123`

---

### Paso 2: Ejecutar Todo el Setup Automático

Una vez conectado, copia y pega TODO este bloque:

```bash
#!/bin/bash
# === CONFIGURACIÓN AUTOMÁTICA DE BASE DE DATOS ===

# Variables
REPLICA_HOST="137.66.22.179"
REPLICA_PORT="5433"
REPLICA_USER="postgres"
REPLICA_PASS="qOSDBG6Bd5MQ3je"
NEW_DB_NAME="mch_local"

echo "🚀 Iniciando configuración..."
echo ""

# 1. Instalar PostgreSQL (si no está instalado)
echo "📦 Instalando PostgreSQL..."
if ! command -v psql &> /dev/null; then
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib postgresql-client
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    echo "✅ PostgreSQL instalado"
else
    echo "✅ PostgreSQL ya está instalado"
fi

# 2. Configurar usuarios
echo ""
echo "🔐 Configurando acceso..."
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '${REPLICA_PASS}';" 2>/dev/null
sudo -u postgres psql -c "CREATE USER hommy WITH SUPERUSER PASSWORD 'Parkour123';" 2>/dev/null || true

# 3. Crear directorio de backups
mkdir -p ~/backups
cd ~/backups

# 4. Crear backup desde réplica
echo ""
echo "📦 Creando backup desde réplica..."
BACKUP_FILE="mch_backup_$(date +%Y%m%d_%H%M%S).sql"
export PGPASSWORD="${REPLICA_PASS}"

pg_dump -h ${REPLICA_HOST} -p ${REPLICA_PORT} -U ${REPLICA_USER} -d postgres \
    --no-owner --no-privileges -f ${BACKUP_FILE}

if [ -f ${BACKUP_FILE} ]; then
    echo "✅ Backup creado: ${BACKUP_FILE} ($(du -h ${BACKUP_FILE} | cut -f1))"
else
    echo "❌ Error al crear backup"
    exit 1
fi

# 5. Crear base de datos nueva
echo ""
echo "🗄️ Creando base de datos '${NEW_DB_NAME}'..."
sudo -u postgres dropdb ${NEW_DB_NAME} 2>/dev/null || true
sudo -u postgres createdb ${NEW_DB_NAME}
sudo -u postgres psql -d ${NEW_DB_NAME} -c "CREATE EXTENSION IF NOT EXISTS unaccent;" 2>/dev/null

# 6. Restaurar backup
echo ""
echo "📥 Restaurando backup (puede tardar varios minutos)..."
psql -h localhost -U postgres -d ${NEW_DB_NAME} -f ${BACKUP_FILE} > /tmp/restore.log 2>&1

echo "✅ Restauración completada"

# 7. Verificar
echo ""
echo "🔍 Verificando..."
export PGPASSWORD="${REPLICA_PASS}"

READ_ONLY=$(psql -h localhost -U postgres -d ${NEW_DB_NAME} -t -c "SHOW transaction_read_only;" | tr -d ' ')
IN_RECOVERY=$(psql -h localhost -U postgres -d ${NEW_DB_NAME} -t -c "SELECT pg_is_in_recovery();" | tr -d ' ')
TABLE_COUNT=$(psql -h localhost -U postgres -d ${NEW_DB_NAME} -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';" | tr -d ' ')
USER_COUNT=$(psql -h localhost -U postgres -d ${NEW_DB_NAME} -t -c "SELECT COUNT(*) FROM tbl_usuario;" 2>/dev/null | tr -d ' ')

echo "  Read-only: $READ_ONLY (debe ser 'off')"
echo "  Recovery: $IN_RECOVERY (debe ser 'f')"
echo "  Tablas: $TABLE_COUNT"
echo "  Usuarios: $USER_COUNT"

# 8. Crear usuario de prueba
echo ""
echo "👤 Creando usuario de prueba..."
psql -h localhost -U postgres -d ${NEW_DB_NAME} <<'SQL'
DO $$
DECLARE
    nuevo_usuario_id BIGINT;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM tbl_usuario WHERE username = 'usuario_prueba') THEN
        INSERT INTO tbl_usuario (
            username, email, password, nombre, apellido, nombre_completo,
            estado, fecha_creacion, fecha_ultimo_cambio, idusuario, telefono
        ) VALUES (
            'usuario_prueba',
            'prueba@test.com',
            '8bb6118f8fd6935ad0876a3be34a717d32708ffd',
            'Usuario',
            'Prueba',
            'Usuario Prueba',
            1,
            NOW(),
            NOW(),
            1,
            '+34600000000'
        ) RETURNING id INTO nuevo_usuario_id;

        INSERT INTO tbl_usuario_x_rol (idusuario, idrol)
        VALUES (nuevo_usuario_id, 'colaborador');

        RAISE NOTICE 'Usuario creado con ID: %', nuevo_usuario_id;
    ELSE
        RAISE NOTICE 'Usuario ya existe';
    END IF;
END $$;
SQL

# Verificar usuario
psql -h localhost -U postgres -d ${NEW_DB_NAME} -c \
  "SELECT u.id, u.username, u.email, u.nombre_completo, r.idrol
   FROM tbl_usuario u
   LEFT JOIN tbl_usuario_x_rol r ON u.id = r.idusuario
   WHERE u.username = 'usuario_prueba';"

echo ""
echo "════════════════════════════════════════════════════════"
echo "✅ CONFIGURACIÓN COMPLETADA"
echo "════════════════════════════════════════════════════════"
echo ""
echo "📊 Nueva Base de Datos:"
echo "   Host: localhost"
echo "   Puerto: 5432"
echo "   BD: ${NEW_DB_NAME}"
echo "   Usuario: postgres"
echo "   Pass: ${REPLICA_PASS}"
echo ""
echo "👤 Usuario de Prueba:"
echo "   Username: usuario_prueba"
echo "   Password: Test123!"
echo "   Rol: colaborador"
echo ""
echo "📝 Próximos pasos:"
echo "   1. Actualizar .env de la aplicación"
echo "   2. Reiniciar con: pm2 restart mchapi"
echo ""
```

---

### Paso 3: Actualizar Configuración de la Aplicación

Después de que termine el script anterior, actualiza el archivo `.env`:

```bash
# Ubicar la aplicación (puede variar)
cd ~
find . -name "mchApi-main" -o -name "mchapi" 2>/dev/null

# O buscar donde está el .env
find /home -name ".env" -path "*/mch*" 2>/dev/null

# Editar el archivo .env
nano /ruta/a/mchApi-main/.env

# Cambiar estas líneas:
POSTGRES_PROD_HOST=localhost
POSTGRES_PROD_PORT=5432
POSTGRES_PROD_DB=mch_local
POSTGRES_PROD_USER=postgres
POSTGRES_PROD_PASSWORD=qOSDBG6Bd5MQ3je

# También cambiar para desarrollo:
POSTGRES_DEV_HOST=localhost
POSTGRES_DEV_PORT=5432
POSTGRES_DEV_DB=mch_local

# Guardar: Ctrl+O, Enter, Ctrl+X
```

---

### Paso 4: Reiniciar la Aplicación

```bash
# Si usa PM2
pm2 restart mchapi
pm2 logs mchapi

# Si usa systemd
sudo systemctl restart mchapi

# O si se ejecuta manualmente
# (detener proceso actual y volver a iniciar)
```

---

### Paso 5: Probar

```bash
# Probar localmente en el servidor
curl http://localhost:3016/api/share/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"usuario_prueba","password":"Test123!"}'

# Debería retornar un token de autenticación
```

---

## 🔍 Comandos Útiles

### Ver estado de PostgreSQL
```bash
sudo systemctl status postgresql
```

### Conectar a la base de datos
```bash
export PGPASSWORD='qOSDBG6Bd5MQ3je'
psql -h localhost -U postgres -d mch_local
```

### Ver tablas
```bash
psql -h localhost -U postgres -d mch_local -c "\dt"
```

### Contar usuarios
```bash
psql -h localhost -U postgres -d mch_local -c "SELECT COUNT(*) FROM tbl_usuario;"
```

### Ver usuarios creados
```bash
psql -h localhost -U postgres -d mch_local -c "SELECT id, username, email FROM tbl_usuario ORDER BY id DESC LIMIT 10;"
```

### Verificar que NO es solo lectura
```bash
psql -h localhost -U postgres -d mch_local -c "SHOW transaction_read_only;"
# Debe retornar: off
```

### Ver logs del backup/restauración
```bash
tail -f /tmp/restore.log
```

---

## ⚠️ Solución de Problemas

### Error: "Could not connect to database"
```bash
# Verificar que PostgreSQL está corriendo
sudo systemctl status postgresql
sudo systemctl start postgresql
```

### Error: "pg_dump: command not found"
```bash
# Instalar cliente PostgreSQL
sudo apt update
sudo apt install -y postgresql-client
```

### Error: "Port 5432 already in use"
```bash
# Ver qué proceso usa el puerto
sudo lsof -i :5432
sudo netstat -tlnp | grep 5432
```

### La aplicación no conecta
```bash
# Verificar .env
cat /ruta/a/.env | grep POSTGRES

# Verificar que la BD existe
sudo -u postgres psql -l | grep mch_local

# Ver logs de la aplicación
pm2 logs mchapi --lines 50
```

### Backup muy lento
```bash
# Ver progreso
watch -n 5 'ls -lh ~/backups/*.sql'

# El tiempo depende del tamaño de la BD
# Puede tardar de 5 minutos a 1 hora
```

---

## 📊 Resultado Final

Después de completar todos los pasos tendrás:

```
Servidor 185.252.233.57
├── PostgreSQL instalado ✅
├── Base de datos: mch_local ✅
│   ├── Con todos los datos de la réplica
│   ├── Modo: LECTURA + ESCRITURA ✅
│   └── Usuario de prueba creado ✅
└── Aplicación configurada para usar nueva BD ✅
```

---

## 🎯 Ventajas

✅ Base de datos local en tu servidor
✅ Permisos completos de escritura
✅ No depende de la BD principal interna
✅ Puedes crear usuarios libremente
✅ Ideal para desarrollo y testing

---

## 📞 ¿Necesitas Ayuda?

Si algo no funciona:
1. Revisa los logs: `tail -f /tmp/restore.log`
2. Verifica PostgreSQL: `sudo systemctl status postgresql`
3. Comprueba conexión: `psql -h localhost -U postgres -l`
4. Revisa permisos: `ls -la ~/backups/`

---

**¡Listo! Copia el script del Paso 2 y ejecútalo en tu servidor.** 🚀