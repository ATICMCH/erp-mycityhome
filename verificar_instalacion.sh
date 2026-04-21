#!/bin/bash
# Script para verificar que la base de datos se creó correctamente

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  🔍 VERIFICACIÓN DE INSTALACIÓN DE BASE DE DATOS         ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Variables
NEW_DB_NAME="mch_local"
DB_PASS="qOSDBG6Bd5MQ3je"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "1️⃣  Verificando PostgreSQL..."
echo "────────────────────────────────────────────────────────────"
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✅ PostgreSQL instalado${NC}"
    psql --version
else
    echo -e "${RED}❌ PostgreSQL NO está instalado${NC}"
    exit 1
fi

echo ""
echo "2️⃣  Verificando servicio PostgreSQL..."
echo "────────────────────────────────────────────────────────────"
if systemctl is-active --quiet postgresql; then
    echo -e "${GREEN}✅ PostgreSQL está corriendo${NC}"
else
    echo -e "${RED}❌ PostgreSQL NO está corriendo${NC}"
    echo "   Iniciar con: sudo systemctl start postgresql"
fi

echo ""
echo "3️⃣  Verificando base de datos '${NEW_DB_NAME}'..."
echo "────────────────────────────────────────────────────────────"
export PGPASSWORD="${DB_PASS}"

if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw ${NEW_DB_NAME}; then
    echo -e "${GREEN}✅ Base de datos '${NEW_DB_NAME}' existe${NC}"
else
    echo -e "${RED}❌ Base de datos '${NEW_DB_NAME}' NO existe${NC}"
    echo "   Necesitas ejecutar el script de instalación"
    exit 1
fi

echo ""
echo "4️⃣  Verificando permisos de escritura..."
echo "────────────────────────────────────────────────────────────"
READ_ONLY=$(psql -h localhost -U postgres -d ${NEW_DB_NAME} -t -c "SHOW transaction_read_only;" 2>/dev/null | tr -d ' ')
if [ "$READ_ONLY" = "off" ]; then
    echo -e "${GREEN}✅ Base de datos con ESCRITURA habilitada${NC}"
else
    echo -e "${RED}❌ Base de datos en modo SOLO LECTURA${NC}"
fi

echo ""
echo "5️⃣  Verificando modo recovery..."
echo "────────────────────────────────────────────────────────────"
IN_RECOVERY=$(psql -h localhost -U postgres -d ${NEW_DB_NAME} -t -c "SELECT pg_is_in_recovery();" 2>/dev/null | tr -d ' ')
if [ "$IN_RECOVERY" = "f" ]; then
    echo -e "${GREEN}✅ NO está en modo recovery (correcto)${NC}"
else
    echo -e "${RED}❌ Está en modo recovery${NC}"
fi

echo ""
echo "6️⃣  Contando tablas..."
echo "────────────────────────────────────────────────────────────"
TABLE_COUNT=$(psql -h localhost -U postgres -d ${NEW_DB_NAME} -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';" 2>/dev/null | tr -d ' ')
if [ ! -z "$TABLE_COUNT" ] && [ "$TABLE_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Tablas encontradas: ${TABLE_COUNT}${NC}"
else
    echo -e "${RED}❌ No se encontraron tablas${NC}"
fi

echo ""
echo "7️⃣  Contando usuarios..."
echo "────────────────────────────────────────────────────────────"
USER_COUNT=$(psql -h localhost -U postgres -d ${NEW_DB_NAME} -t -c "SELECT COUNT(*) FROM tbl_usuario;" 2>/dev/null | tr -d ' ')
if [ ! -z "$USER_COUNT" ] && [ "$USER_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Usuarios en la BD: ${USER_COUNT}${NC}"
else
    echo -e "${YELLOW}⚠️  No se pudo contar usuarios o tabla no existe${NC}"
fi

echo ""
echo "8️⃣  Verificando usuario de prueba..."
echo "────────────────────────────────────────────────────────────"
TEST_USER=$(psql -h localhost -U postgres -d ${NEW_DB_NAME} -t -c "SELECT username FROM tbl_usuario WHERE username='usuario_prueba';" 2>/dev/null | tr -d ' ')
if [ "$TEST_USER" = "usuario_prueba" ]; then
    echo -e "${GREEN}✅ Usuario 'usuario_prueba' existe${NC}"
    echo ""
    echo "   Detalles del usuario:"
    psql -h localhost -U postgres -d ${NEW_DB_NAME} -c "SELECT u.id, u.username, u.email, u.nombre_completo, r.idrol FROM tbl_usuario u LEFT JOIN tbl_usuario_x_rol r ON u.id = r.idusuario WHERE u.username = 'usuario_prueba';"
else
    echo -e "${YELLOW}⚠️  Usuario 'usuario_prueba' NO existe${NC}"
    echo "   Puedes crearlo manualmente"
fi

echo ""
echo "9️⃣  Verificando backups..."
echo "────────────────────────────────────────────────────────────"
if [ -d ~/backups ]; then
    BACKUP_COUNT=$(ls -1 ~/backups/mch_backup_*.sql 2>/dev/null | wc -l)
    if [ "$BACKUP_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✅ Backups encontrados: ${BACKUP_COUNT}${NC}"
        echo ""
        echo "   Últimos backups:"
        ls -lht ~/backups/mch_backup_*.sql 2>/dev/null | head -3 | awk '{print "   " $9 " (" $5 ")"}'
    else
        echo -e "${YELLOW}⚠️  No se encontraron backups${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Directorio ~/backups no existe${NC}"
fi

echo ""
echo "🔟  Verificando configuración de la aplicación..."
echo "────────────────────────────────────────────────────────────"

# Buscar archivos .env
ENV_FILES=$(find ~ -name ".env" -path "*mch*" 2>/dev/null)

if [ ! -z "$ENV_FILES" ]; then
    echo -e "${GREEN}✅ Archivos .env encontrados:${NC}"
    echo "$ENV_FILES" | while read env_file; do
        echo ""
        echo "   📄 $env_file"
        echo "   ──────────────────────────────────────────────"
        grep -E "POSTGRES.*HOST|POSTGRES.*PORT|POSTGRES.*DB" "$env_file" 2>/dev/null | head -6 | sed 's/^/      /'
    done
else
    echo -e "${YELLOW}⚠️  No se encontraron archivos .env${NC}"
    echo "   Busca manualmente con: find / -name '.env' -path '*mch*' 2>/dev/null"
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  📊 RESUMEN DE VERIFICACIÓN                              ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Calcular estado general
CHECKS_PASSED=0
CHECKS_TOTAL=0

if command -v psql &> /dev/null; then ((CHECKS_PASSED++)); fi
((CHECKS_TOTAL++))

if systemctl is-active --quiet postgresql; then ((CHECKS_PASSED++)); fi
((CHECKS_TOTAL++))

if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw ${NEW_DB_NAME}; then ((CHECKS_PASSED++)); fi
((CHECKS_TOTAL++))

if [ "$READ_ONLY" = "off" ]; then ((CHECKS_PASSED++)); fi
((CHECKS_TOTAL++))

if [ "$IN_RECOVERY" = "f" ]; then ((CHECKS_PASSED++)); fi
((CHECKS_TOTAL++))

if [ ! -z "$TABLE_COUNT" ] && [ "$TABLE_COUNT" -gt 0 ]; then ((CHECKS_PASSED++)); fi
((CHECKS_TOTAL++))

echo "Verificaciones pasadas: ${CHECKS_PASSED}/${CHECKS_TOTAL}"

if [ $CHECKS_PASSED -eq $CHECKS_TOTAL ]; then
    echo -e "${GREEN}✅ ¡TODO ESTÁ CONFIGURADO CORRECTAMENTE!${NC}"
    echo ""
    echo "🎉 Puedes empezar a usar la base de datos"
    echo ""
    echo "📝 Próximos pasos:"
    echo "   1. Actualizar .env de la aplicación (si no lo has hecho)"
    echo "   2. Reiniciar aplicación: pm2 restart mchapi"
    echo "   3. Probar login con usuario_prueba"
elif [ $CHECKS_PASSED -ge 4 ]; then
    echo -e "${YELLOW}⚠️  Configuración parcialmente completa${NC}"
    echo ""
    echo "Revisa los puntos marcados con ❌ arriba"
else
    echo -e "${RED}❌ La configuración tiene problemas${NC}"
    echo ""
    echo "Necesitas ejecutar el script de instalación"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
