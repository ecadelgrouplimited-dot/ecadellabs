#!/bin/bash
# ECADEL LABS — Daily SQLite database backup
# Run via cron: 0 2 * * * /var/www/ecadellabs/scripts/backup-db.sh >> /var/log/ecadellabs-backup.log 2>&1

set -e

DB_SOURCE="/var/www/ecadellabs/prisma/ecadellabs.db"
BACKUP_DIR="/var/backups/ecadellabs"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/ecadellabs_$TIMESTAMP.db"
KEEP_DAYS=14

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Dump the SQLite database (safe hot copy)
sqlite3 "$DB_SOURCE" ".backup '$BACKUP_FILE'"

# Compress
gzip "$BACKUP_FILE"

echo "[$(date -Iseconds)] Backup created: ${BACKUP_FILE}.gz ($(du -sh "${BACKUP_FILE}.gz" | cut -f1))"

# Remove backups older than KEEP_DAYS
find "$BACKUP_DIR" -name "*.db.gz" -mtime +$KEEP_DAYS -delete
REMAINING=$(ls -1 "$BACKUP_DIR"/*.db.gz 2>/dev/null | wc -l)
echo "[$(date -Iseconds)] Backup cleanup done — $REMAINING backup(s) retained"
