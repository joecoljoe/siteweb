# joecoljoe/siteweb — Site officiel de Joe Col Joe

Ce repo **EST** la source de production du site **https://joecoljoe.com**.

## 🚀 Déploiement (automatique)
Chaque `push` sur la branche **`main`** déclenche un déploiement automatique
via un **Cloudflare Worker** (Workers Builds). Le site est en ligne ~1-2 min après.
**Aucune autre étape** : pas de build manuel, pas de validation, pas de FTP.

> ⚠️ Ne PAS utiliser l'ancien repo `prodlechat/joecoljoe` : il est déconnecté
> de Cloudflare et ne publie plus rien. Tout passe par CE repo (`joecoljoe/siteweb`).

## 👥 Plusieurs contributeurs (Tarik + Joel)
Deux personnes poussent directement sur `main`. Pour éviter les conflits :
1. **Toujours** `git pull --rebase origin main` AVANT de commencer à éditer.
2. Faire des commits petits et fréquents.
3. `git push origin main` → c'est en ligne.

## 🧩 Structure du site (statique, sans framework)
- `index.html` — accueil
- `biographie.html`, `contact.html`, `mentions-legales.html`, `politique-confidentialite.html`
- `blog.html` + dossier `blog/` (articles)
- `assets/` (images .webp/.jpg, fonts, vendor), `css/`, `js/`
- `_headers` — règles de cache Cloudflare (ne pas casser la syntaxe)

## ↩️ Revenir en arrière (rollback)
- **Cloudflare** : Worker `joecoljoe` → onglet *Deployments* → choisir un déploiement précédent → *Rollback*.
- **Git** : `git revert <commit>` puis `git push` (redéploie la version d'avant).
- La branche **`onepage-backup`** conserve l'ancienne version one-page du site.

## ✅ Règle d'or
Si tu vois un changement à publier sur joecoljoe.com : édite ici, `push` sur `main`, c'est tout.
