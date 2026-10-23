# Verificación contra sitios reales (sin sesión, WebKit)

Fecha: 2026-10-23T04:15:54.678Z

| Plataforma | URL | Esperado | URL final | Motor activo | Selectores que coinciden | Ocultos por texto/tope | Muro de login | Error |
|---|---|---|---|---|---|---|---|---|
| youtube | https://m.youtube.com/ | Inicio sustituido por buscador; sin Shorts | https://m.youtube.com/?ra=m | sí | 9 | 0 | no |  |
| youtube | https://m.youtube.com/results?search_query=guitar+lesson | Resultados sin Shorts | https://m.youtube.com/results?search_query=guitar+lesson&ra=m | sí | 5 | 0 | no |  |
| youtube | https://m.youtube.com/watch?v=dQw4w9WgXcQ | Sin relacionados ni pantalla final | https://m.youtube.com/watch?v=dQw4w9WgXcQ&ra=m | sí | 1 | 0 | no |  |
| instagram | https://www.instagram.com/explore/ | Explore → búsqueda | https://www.instagram.com/accounts/login/?next=https%3A%2F%2Fwww.instagram.com%2Fexplore%2Fsearch%2F%3F__coig_login%3D1 | sí | 0 | 0 | sí |  |
| instagram | https://www.instagram.com/instagram/ | Perfil público visible | https://www.instagram.com/accounts/login/?next=https%3A%2F%2Fwww.instagram.com%2Finstagram%2F&is_from_rle | sí | 0 | 0 | sí |  |
| tiktok | https://www.tiktok.com/ | Para ti → Siguiendo | https://www.tiktok.com/following | sí | 0 | 0 | sí |  |
| tiktok | https://www.tiktok.com/@tiktok | Perfil visible | https://www.tiktok.com/@tiktok | sí | 0 | 0 | no |  |
| reddit | https://www.reddit.com/r/popular/ | Popular → inicio | https://www.reddit.com/ | sí | 0 | 0 | sí |  |
| reddit | https://www.reddit.com/r/AskReddit/ | Comunidad visible, con tope de feed | https://www.reddit.com/r/AskReddit/ | sí | 0 | 0 | sí |  |
| x | https://x.com/explore | Sin tendencias | https://x.com/explore | sí | 0 | 0 | no |  |
| facebook | https://m.facebook.com/ | Inicio "Más recientes" | https://m.facebook.com/?sk=h_chr | sí | 0 | 0 | sí |  |
| linkedin | https://www.linkedin.com/feed/ | Feed con tope | https://www.linkedin.com/login/?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Ffeed%2F | sí | 0 | 0 | sí |  |
| threads | https://www.threads.com/ | Siguiendo / sin sugerencias | https://www.threads.com/?hpir=1&http_ref=eyJ0cyI6MTc5MjcyODkzNzAwMCwiciI6IiJ9 | sí | 0 | 0 | sí |  |
| pinterest | https://www.pinterest.com/ | Inicio sustituido por buscador | https://www.pinterest.com/ | sí | 7 | 0 | sí |  |
