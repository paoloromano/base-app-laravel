/**
 * Ricava le iniziali da un nome completo per l'Avatar.
 * "Mario Rossi" -> "MR", "Mario" -> "M". Max 2 lettere, maiuscole.
 * Filtra i token vuoti per gestire spazi doppi/iniziali/finali.
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}
