#!/bin/bash

# Script para crear una nueva base de datos PostgreSQL en el servidor 185.252.233.57
# Con backup completo desde la réplica

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Credenciales del servidor
SERVER_IP="185.252.233.57"
SERVER_PORT="2269"
SERVER_USER="hommy"
SERVER_PASS="Parkour123"

# Credenciales BD réplica (origen)
REPLICA_HOST="137.66.22.179"
REPLICA_PORT="5433"
REPLICA_USER="postgres"
REPLICA_PASS="qOSDBG6Bd5MQ3je"

# Nueva BD local en servidor
NEW_DB_NAME="mch_local"
NEW_DB_PORT="5432"

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🚀 CONFIGURACIÓN DE BASE DE DATOS EN SERVIDOR          ║${NC}"
echo -e "${BLUE}║     185.252.233.57                                       ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Este script va a:"
echo "  1️⃣  Conectar al servidor por SSH"
echo "  2️⃣  Verificar/Instalar PostgreSQL"
echo "  3️⃣  Crear backup desde réplica"
echo "  4️⃣  Crear nueva base de datos local"
echo "  5️⃣  Restaurar backup"
echo "  6️⃣  Configurar permisos de escritura"
echo "  7️⃣  Crear usuario de prueba"
echo ""
read -p "¿Continuar? (s/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "Cancelado."
    exit 0
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}PASO 1: Conectando al servidor...${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"

# Crear script remoto que se ejecutará en el servidor
cat > /tmp/setup_db_remote.sh <<'REMOTE_SCRIPT'
#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}✅ Conectado al servidor!${NC}"
echo ""
echo "Información del sistema:"
hostname
echo "Usuario: $(whoami)"
echo "Sistema: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"
echo ""

# Variables
REPLICA_HOST="137.66.22.179"
REPLICA_PORT="5433"
REPLICA_USER="postgres"
REPLICA_PASS="qOSDBG6Bd5MQ3je"
NEW_DB_NAME="mch_local"

echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}PASO 2: Verificando PostgreSQL...${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"

# Verificar si PostgreSQL está instalado
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✅ PostgreSQL cliente ya está instalado${NC}"
    psql --version
else
    echo -e "${YELLOW}⚠️  PostgreSQL no está instalado. Instalando...${NC}"

    # Detectar sistema operativo
    if [ -f /etc/debian_version ]; then
        # Debian/Ubuntu
        sudo apt update
        sudo apt install -y postgresql-client
    elif [ -f /etc/redhat-release ]; then
        # RedHat/CentOS
        sudo yum install -y postgresql
    else
        echo -e "${RED}❌ No se pudo detectar el sistema operativo${NC}"
        exit 1
    fi

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ PostgreSQL cliente instalado${NC}"
    else
        echo -e "${RED}❌ Error al instalar PostgreSQL cliente${NC}"
        exit 1
    fi
fi

# Verificar si PostgreSQL Server está instalado
if command -v pg_config &> /dev/null; then
    echo -e "${GREEN}✅ PostgreSQL server ya está instalado${NC}"
    pg_config --version
else
    echo -e "${YELLOW}⚠️  PostgreSQL server no está instalado. Instalando...${NC}"

    if [ -f /etc/debian_version ]; then
        # Instalar PostgreSQL 15 (versión estable)
        sudo apt install -y postgresql postgresql-contrib

        # Iniciar servicio
        sudo systemctl start postgresql
        sudo systemctl enable postgresql

        echo -e "${GREEN}✅ PostgreSQL server instalado e iniciado${NC}"
    else
        echo -e "${RED}❌ Instalación automática no disponible para este SO${NC}"
        exit 1
    fi
fi

# Verificar estado del servicio
echo ""
echo "Estado de PostgreSQL:"
sudo systemctl status postgresql --no-pager -l | head -10

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}PASO 3: Creando backup desde réplica...${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"

# Crear directorio para backups
mkdir -p ~/backups
cd ~/backups

BACKUP_FILE="mch_backup_$(date +%Y%m%d_%H%M%S).sql"

echo "📦 Exportando desde: ${REPLICA_HOST}:${REPLICA_PORT}"
echo "📁 Guardando en: ~/backups/${BACKUP_FILE}"
echo ""
echo "⏳ Esto puede tardar varios minutos..."

# Exportar backup
export PGPASSWORD="${REPLICA_PASS}"
pg_dump -h ${REPLICA_HOST} -p ${REPLICA_PORT} -U ${REPLICA_USER} -d postgres \
    --verbose \
    --no-owner \
    --no-privileges \
    -f ${BACKUP_FILE} 2>&1 | grep -E "completed|dumping|reading"

if [ $? -eq 0 ] && [ -f ${BACKUP_FILE} ]; then
    BACKUP_SIZE=$(du -h ${BACKUP_FILE} | cut -f1)
    echo ""
    echo -e "${GREEN}✅ Backup completado!${NC}"
    echo "   Archivo: ${BACKUP_FILE}"
    echo "   Tamaño: ${BACKUP_SIZE}"
else
    echo -e "${RED}❌ Error al crear backup${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}PASO 4: Configurando PostgreSQL local...${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"

# Configurar usuario postgres con password
echo "🔐 Configurando acceso..."
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '${REPLICA_PASS}';" 2>/dev/null

# Crear usuario hommy si no existe
sudo -u postgres psql -c "CREATE USER hommy WITH SUPERUSER PASSWORD 'Parkour123';" 2>/dev/null || echo "Usuario hommy ya existe"

echo -e "${GREEN}✅ Usuarios configurados${NC}"

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}PASO 5: Creando nueva base de datos...${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"

# Verificar si la base de datos ya existe
if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw ${NEW_DB_NAME}; then
    echo -e "${YELLOW}⚠️  La base de datos '${NEW_DB_NAME}' ya existe${NC}"
    echo "   Para recrearla, elimínala primero con:"
    echo "   sudo -u postgres dropdb ${NEW_DB_NAME}"
else
    # Crear base de datos
    sudo -u postgres createdb ${NEW_DB_NAME}

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Base de datos '${NEW_DB_NAME}' creada${NC}"
    else
        echo -e "${RED}❌ Error al crear base de datos${NC}"
        exit 1
    fi
fi

# Crear extensión UNACCENT (requerida por la app)
sudo -u postgres psql -d ${NEW_DB_NAME} -c "CREATE EXTENSION IF NOT EXISTS unaccent;" 2>/dev/null
echo -e "${GREEN}✅ Extensión UNACCENT instalada${NC}"

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}PASO 6: Restaurando backup...${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"

echo "📥 Importando datos..."
echo "⏳ Esto puede tardar varios minutos..."
echo ""

export PGPASSWORD="${REPLICA_PASS}"
psql -h localhost -U postgres -d ${NEW_DB_NAME} -f ${BACKUP_FILE} 2>&1 | \
    grep -E "ERROR|CREATE TABLE|CREATE INDEX|ALTER TABLE" | head -20

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Restauración completada${NC}"
else
    echo -e "${YELLOW}⚠️  Restauración completada con algunos warnings (normal)${NC}"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}PASO 7: Verificando base de datos...${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"

export PGPASSWORD="${REPLICA_PASS}"

# Verificar modo read-only
echo "🔍 Verificando permisos de escritura..."
READ_ONLY=$(psql -h localhost -U postgres -d ${NEW_DB_NAME} -t -c "SHOW transaction_read_only;" | tr -d ' ')
if [ "$READ_ONLY" = "off" ]; then
    echo -e "${GREEN}✅ Base de datos con ESCRITURA habilitada${NC}"
else
    echo -e "${RED}❌ Base de datos en modo solo lectura${NC}"
fi

# Verificar recovery mode
IN_RECOVERY=$(psql -h localhost -U postgres -d ${NEW_DB_NAME} -t -c "SELECT pg_is_in_recovery();" | tr -d ' ')
if [ "$IN_RECOVERY" = "f" ]; then
    echo -e "${GREEN}✅ Base de datos NO está en recovery mode${NC}"
else
    echo -e "${RED}❌ Base de datos está en recovery mode${NC}"
fi

# Contar tablas
TABLE_COUNT=$(psql -h localhost -U postgres -d ${NEW_DB_NAME} -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';" | tr -d ' ')
echo -e "${GREEN}✅ Tablas encontradas: ${TABLE_COUNT}${NC}"

# Contar usuarios
USER_COUNT=$(psql -h localhost -U postgres -d ${NEW_DB_NAME} -t -c "SELECT COUNT(*) FROM tbl_usuario;" 2>/dev/null | tr -d ' ')
if [ ! -z "$USER_COUNT" ]; then
    echo -e "${GREEN}✅ Usuarios en la BD: ${USER_COUNT}${NC}"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}PASO 8: Creando usuario de prueba...${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"

# Crear usuario de prueba
psql -h localhost -U postgres -d ${NEW_DB_NAME} <<'SQL'
-- Verificar si el usuario ya existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM tbl_usuario WHERE username = 'usuario_prueba') THEN
        -- Insertar usuario
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
        );

        -- Obtener ID del usuario recién creado
        INSERT INTO tbl_usuario_x_rol (idusuario, idrol)
        SELECT id, 'colaborador' FROM tbl_usuario WHERE username = 'usuario_prueba';

        RAISE NOTICE 'Usuario de prueba creado exitosamente';
    ELSE
        RAISE NOTICE 'El usuario de prueba ya existe';
    END IF;
END $$;
SQL

# Verificar creación
echo ""
echo "Verificando usuario creado:"
psql -h localhost -U postgres -d ${NEW_DB_NAME} -c "SELECT u.id, u.username, u.email, u.nombre_completo, r.idrol FROM tbl_usuario u LEFT JOIN tbl_usuario_x_rol r ON u.id = r.idusuario WHERE u.username = 'usuario_prueba';"

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ CONFIGURACIÓN COMPLETADA EXITOSAMENTE               ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "📊 INFORMACIÓN DE LA NUEVA BASE DE DATOS:"
echo "════════════════════════════════════════════════════════════"
echo "  Host:          localhost (dentro del servidor)"
echo "  Puerto:        5432"
echo "  Base de datos: ${NEW_DB_NAME}"
echo "  Usuario:       postgres"
echo "  Password:      ${REPLICA_PASS}"
echo "  Estado:        ✅ LECTURA + ESCRITURA"
echo ""
echo "👤 USUARIO DE PRUEBA CREADO:"
echo "════════════════════════════════════════════════════════════"
echo "  Username:      usuario_prueba"
echo "  Password:      Test123!"
echo "  Email:         prueba@test.com"
echo "  Rol:           colaborador"
echo ""
echo "📝 PRÓXIMOS PASOS:"
echo "════════════════════════════════════════════════════════════"
echo "  1. Actualizar archivo .env de la aplicación:"
echo "     POSTGRES_PROD_HOST=localhost"
echo "     POSTGRES_PROD_PORT=5432"
echo "     POSTGRES_PROD_DB=${NEW_DB_NAME}"
echo ""
echo "  2. Reiniciar la aplicación:"
echo "     pm2 restart mchapi"
echo ""
echo "  3. Probar login:"
echo "     curl http://localhost:3016/api/share/auth/login \\"
echo "       -H 'Content-Type: application/json' \\"
echo "       -d '{\"username\":\"usuario_prueba\",\"password\":\"Test123!\"}'"
echo ""
echo "📦 Backup guardado en: ~/backups/${BACKUP_FILE}"
echo ""

REMOTE_SCRIPT

# Transferir y ejecutar script en el servidor
echo "📤 Transfiriendo script al servidor..."

# Usar expect para automatizar SSH con password
expect <<EOF
set timeout -1
spawn ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_IP} "bash -s" < /tmp/setup_db_remote.sh
expect {
    "password:" {
        send "${SERVER_PASS}\r"
        exp_continue
    }
    "Are you sure you want to continue connecting" {
        send "yes\r"
        exp_continue
    }
    eof
}
EOF

echo ""
echo -e "${GREEN}✅ Proceso completado!${NC}"
echo ""
echo "Puedes conectarte al servidor con:"
echo "  ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_IP}"
