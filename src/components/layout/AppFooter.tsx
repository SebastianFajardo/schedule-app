
import React from 'react';

export default function AppFooter() {
  return (
    <footer className="shrink-0 border-t bg-card p-4 text-center text-sm text-muted-foreground">
      <p>&copy; {new Date().getFullYear()} MediSchedule. Todos los derechos reservados.</p>
    </footer>
  );
}
