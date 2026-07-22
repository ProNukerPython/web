#!/usr/bin/env python3
"""Generate the static inner pages (about, projects, reel, blog, contact).

The home page (index.html) is hand-maintained; these pages share
assets/site.css and a common shell. Re-run this script after editing
PAGES/PROJECTS/ARTICLES below:  python3 tools/build_pages.py
"""
import json
import os
import re

SITE = "https://marc-castellvi.com"
PERSON_ID = SITE + "/#person"
OG_IMAGE = SITE + "/assets/og-card.png"
ROOT = os.path.join(os.path.dirname(__file__), "..")

NAV = """<nav class="site-nav" aria-label="Main navigation">
  <a class="brand" href="/">MARC CASTELLVÍ<span class="dot"> ●</span> COMP</a>
  <ul>
    <li><a href="/about/"{c_about}>About</a></li>
    <li><a href="/projects/"{c_projects}>Projects</a></li>
    <li><a href="/reel/"{c_reel}>Reel</a></li>
    <li><a href="/blog/"{c_blog}>Blog</a></li>
    <li><a href="/contact/"{c_contact}>Contact</a></li>
  </ul>
</nav>"""

FOOTER = """<footer class="site-footer">
  <nav aria-label="Site pages">
    <a href="/">Home</a>
    <a href="/about/">About</a>
    <a href="/projects/">Projects</a>
    <a href="/reel/">Reel</a>
    <a href="/blog/">Blog</a>
    <a href="/contact/">Contact</a>
  </nav>
  <span>© 2026 MARC CASTELLVÍ VILA · COMP · MADRID</span>
</footer>"""


def breadcrumb_ld(crumbs):
    items = []
    for i, (name, url) in enumerate(crumbs, 1):
        item = {"@type": "ListItem", "position": i, "name": name}
        if url:
            item["item"] = SITE + url
        items.append(item)
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": items}


def render(path, title, description, body, crumbs, extra_ld=None, og_image=OG_IMAGE,
           og_type="website", wide=False, active=None):
    url = SITE + path
    nav = NAV.format(**{
        f"c_{k}": (' aria-current="page"' if k == active else "")
        for k in ["about", "projects", "reel", "blog", "contact"]
    })
    ld_blocks = [breadcrumb_ld(crumbs)]
    if extra_ld:
        ld_blocks.extend(extra_ld if isinstance(extra_ld, list) else [extra_ld])
    ld_html = "\n".join(
        '<script type="application/ld+json">\n' + json.dumps(b, ensure_ascii=False, indent=2) + "\n</script>"
        for b in ld_blocks
    )
    crumbs_html = '<span class="sep">/</span>'.join(
        (f'<a href="{u}">{n}</a>' if u else f"<span>{n}</span>") for n, u in crumbs
    )
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{description}">
<link rel="canonical" href="{url}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/site.css">
<meta name="author" content="Marc Castellví Vila">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#0d0f14">
<meta property="og:type" content="{og_type}">
<meta property="og:url" content="{url}">
<meta property="og:site_name" content="Marc Castellví — Portfolio">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:image" content="{og_image}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{description}">
<meta name="twitter:image" content="{og_image}">
{ld_html}
</head>
<body>
{nav}

<main class="page{' wide' if wide else ''}">
<div class="breadcrumbs mono" aria-label="Breadcrumb">{crumbs_html}</div>
{body}
</main>

{FOOTER}
</body>
</html>
"""
    out = os.path.normpath(os.path.join(ROOT, path.lstrip("/"), "index.html"))
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    print("wrote", os.path.relpath(out, ROOT))


# ═══════════════════════════════════════════════════════════════
# PROJECTS
# ═══════════════════════════════════════════════════════════════
PROJECTS = [
    {
        "slug": "spellbound",
        "title": "Spellbound (Netflix)",
        "studio": "Skydance Animation",
        "role": "Lighting Assistant",
        "dates": "Jan 2024 — May 2024",
        "software": "Autodesk Maya · proprietary lighting pipeline · Nuke",
        "tags": ["Lighting", "Feature film", "Netflix"],
        "video": ("youtube", "jGQiq1ZuCW8"),
        "video_label": "Watch the Spellbound trailer on YouTube",
        "image": "/assets/spellbound.jpg",
        "image_alt": "Still from Spellbound (Netflix) — lighting work by Marc Castellví at Skydance Animation",
        "summary": "Lighting Assistant on Skydance Animation's feature film for Netflix: scene preparation, renders and quality control of the render layers that later live in the comp.",
        "body": """
<h2>What was my role?</h2>
<p>I joined Skydance Animation Madrid as a <strong>Lighting Assistant</strong> on
<em>Spellbound</em>, the studio's animated feature released on Netflix. I supported
the lighting team during the final stretch of production: preparing scenes,
launching and wrangling renders, and doing quality control on the render layers
before they moved downstream to compositing.</p>

<h2>What I worked on</h2>
<ul>
  <li><strong>Scene prep</strong> — getting lighting scenes ready for the artists: correct
      assets, caches and setups in place so shots could be lit without friction.</li>
  <li><strong>Renders</strong> — submitting, monitoring and re-queuing renders across the
      farm, keeping shot delivery on schedule.</li>
  <li><strong>Layer QC</strong> — checking AOVs and render passes for errors (missing
      passes, NaNs, artifacts) before they reached the comp department.</li>
</ul>

<h2>Why it mattered for my compositing career</h2>
<p>Working on the lighting side taught me exactly what happens to a shot
<em>before</em> it reaches Nuke: how passes are structured, what can go wrong in a
render, and what a comp artist should expect from upstream. That knowledge is
the foundation of how I build and debug comp setups today.</p>
""",
    },
    {
        "slug": "swapped",
        "title": "Swapped (Netflix)",
        "studio": "Skydance Animation",
        "role": "Compositing Trainee",
        "dates": "May 2024 — Jul 2024",
        "software": "Nuke · Python",
        "tags": ["Nuke", "Tools", "DiMattes", "Netflix"],
        "video": ("youtube", "glgmAwRDP8s"),
        "video_label": "Watch the Swapped trailer on YouTube",
        "image": "/assets/swapped.jpg",
        "image_alt": "Still from Swapped (Netflix) — compositing tools and DiMatte workflow by Marc Castellví at Skydance Animation",
        "summary": "Compositing Trainee on Skydance Animation's feature for Netflix: compositing tools development and ownership of the DiMatte workflow.",
        "body": """
<h2>What was my role?</h2>
<p>As a <strong>Compositing Trainee</strong> at Skydance Animation Madrid I worked on
<em>Swapped</em>, the studio's animated feature for Netflix, focusing on the
technical side of the comp department.</p>

<h2>What I worked on</h2>
<ul>
  <li><strong>Compositing tools development</strong> — building Nuke tools and gizmos for
      the comp team, streamlining repetitive setups across shots.</li>
  <li><strong>The DiMatte workflow</strong> — I owned the digital matte (DiMatte) workflow
      end to end: how mattes were generated, named, routed and consumed inside the
      comp templates, so every artist got consistent, predictable mattes in every shot.</li>
</ul>

<h2>Challenges</h2>
<p>Owning a workflow used by an entire department means designing for the whole
team, not for yourself: clear naming conventions, defensive tools that fail
loudly, and documentation that a busy artist can absorb in two minutes. That
was the biggest lesson of this production.</p>
""",
    },
    {
        "slug": "sky-the-two-embers",
        "title": "Sky: The Two Embers — Part 1",
        "studio": "Illusorium Studios",
        "role": "Compositing Artist",
        "dates": "Jan 2025 — Jun 2026",
        "software": "Nuke",
        "tags": ["Nuke", "Feature film", "Multipass compositing"],
        "video": ("youtube", "FWepS03YbFU"),
        "video_label": "Watch Sky: The Two Embers on YouTube",
        "image": "/assets/sky-the-two-embers.jpg",
        "image_alt": "Still from Sky: The Two Embers — CG compositing in Nuke by Marc Castellví at Illusorium Studios",
        "summary": "Compositing Artist on the animated feature based on Sky: Children of the Light: artistic 3D multipass compositing in Nuke, developing shots from the lead's template.",
        "body": """
<h2>What was my role?</h2>
<p>At Illusorium Studios in Madrid I worked as a <strong>Compositing Artist</strong> on
<em>Sky: The Two Embers — Part 1</em>, the animated feature based on the game
<em>Sky: Children of the Light</em>.</p>

<h2>What I worked on</h2>
<ul>
  <li><strong>Artistic 3D compositing</strong> — developing shots in Nuke from the lead's
      template: balancing multipass renders, integrating FX elements and taking each
      shot to final.</li>
  <li><strong>Feedback iteration</strong> — working closely with the comp lead and
      supervisors, iterating on notes quickly while keeping the shot consistent with
      the sequence look.</li>
</ul>

<h2>Challenges</h2>
<p>The film has a very painterly, atmospheric look. Matching that aesthetic
shot after shot — glow, haze, light wraps, depth cues — while staying inside the
template's structure was a great exercise in disciplined, art-directed
compositing.</p>
""",
    },
    {
        "slug": "the-quintas-ghost",
        "title": "The Quinta's Ghost",
        "studio": "Illusorium Studios",
        "role": "Lighting & Compositing Tools Development",
        "dates": "2025 — 2026",
        "software": "Nuke · Python",
        "tags": ["Lighting", "Nuke", "Tools"],
        "video": ("youtube", "25_RHP3UB70"),
        "video_label": "Watch The Quinta's Ghost on YouTube",
        "image": "/assets/the-quintas-ghost.jpg",
        "image_alt": "Still from The Quinta's Ghost — lighting and compositing tools by Marc Castellví at Illusorium Studios",
        "summary": "Lighting work and Nuke compositing tools development for the comp team on Illusorium Studios' production The Quinta's Ghost.",
        "body": """
<h2>What was my role?</h2>
<p>On <em>The Quinta's Ghost</em> at Illusorium Studios I combined two sides of my
profile: <strong>lighting</strong> on the production itself, and <strong>compositing tools
development</strong> for the comp team.</p>

<h2>What I worked on</h2>
<ul>
  <li><strong>Lighting</strong> — lighting work on the show, applying what I learned as a
      lighting assistant on feature production.</li>
  <li><strong>Nuke tools</strong> — designing and building compositing tools that the comp
      team used across the production, reducing repetitive setup work and keeping
      shots consistent.</li>
</ul>

<h2>Why this project matters</h2>
<p>It is the clearest example of my dual profile: I understand the shot as an
artist and the pipeline as a developer, and this production let me do both at
the same time.</p>
""",
    },
    {
        "slug": "pocoyo-season-5",
        "title": "Pocoyó — Season 5",
        "studio": "Cocolilo Animation",
        "role": "Compositing Artist | TD",
        "dates": "Mar 2025 — Jul 2025",
        "software": "Nuke · Python",
        "tags": ["Series", "TD", "Pipeline", "Automation"],
        "video": ("youtube", "lPjD5BKZ0E4"),
        "video_label": "Watch Pocoyó season 5 on YouTube",
        "image": "/assets/pocoyo-season-5.jpg",
        "image_alt": "Still from Pocoyó season 5 — Nuke compositing and pipeline by Marc Castellví at Cocolilo Animation",
        "summary": "Compositing Artist and TD on season 5 of Pocoyó: artistic compositing plus development of the show's Nuke pipeline and tools.",
        "body": """
<h2>What was my role?</h2>
<p>For season 5 of <em>Pocoyó</em> at Cocolilo Animation I worked as
<strong>Compositing Artist | TD</strong> — a hybrid role covering both shot work and the
technical backbone of the comp department.</p>

<h2>What I worked on</h2>
<ul>
  <li><strong>Artistic compositing</strong> — comping episodes of the show in Nuke.</li>
  <li><strong>Nuke pipeline development</strong> — building and maintaining the show's comp
      pipeline: automated script setup, versioning and delivery, so episodic volume
      could be handled with a small team.</li>
  <li><strong>Tools</strong> — Python tools inside Nuke to automate the repetitive parts of
      episodic compositing.</li>
</ul>

<h2>Challenges</h2>
<p>Episodic TV lives and dies by throughput. The pipeline had to make the
default path the fast path: an artist opens a shot and everything —
reads, templates, write nodes — is already in place. Building that reliability
was the core of the job.</p>
""",
    },
    {
        "slug": "blacksad",
        "title": "Blacksad — Fan Art",
        "studio": "Illusorium Studios",
        "role": "Compositing Artist",
        "dates": "2025",
        "software": "Nuke",
        "tags": ["Nuke", "Fan art", "STMaps", "Position passes"],
        "video": ("youtube", "t3qnuVscDes"),
        "video_label": "Watch the Blacksad fan art on YouTube",
        "image": "/assets/blacksad.jpg",
        "image_alt": "Still from Blacksad fan art by Illusorium Studios — Nuke compositing by Marc Castellví",
        "summary": "Compositing on Illusorium Studios' fan-art piece based on the noir comic Blacksad, including a custom triplanar STMap tool for applying 2D textures in comp.",
        "body": """
<h2>What was my role?</h2>
<p>I did <strong>compositing</strong> on Illusorium Studios' fan-art piece based on the
noir comic series <em>Blacksad</em>.</p>

<h2>Technical breakdown: triplanar STMaps in comp</h2>
<p>The most interesting part of this project was a tool I built to apply 2D
textures directly in comp. Using <strong>Position and Normal passes</strong> from the
render, the tool generates <strong>triplanar STMaps</strong> (projections along X, Y and
Z) so that any 2D texture can be mapped onto the CG assets from within Nuke —
and it tracks the assets correctly through the shot as the camera and objects
move.</p>
<p>This meant look tweaks — adding grain, wear, printed patterns — could happen
in comp without a round trip to texturing and re-rendering, which is exactly
the kind of iteration speed comp is for.</p>

<h2>Software</h2>
<p>Nuke, working with multichannel EXR renders (Position, Normals, and beauty
AOVs).</p>
""",
    },
    {
        "slug": "glare",
        "title": "GLARE — Short Film",
        "studio": "La Salle BCN",
        "role": "Compositing & Lighting Supervisor",
        "dates": "2022 — 2023",
        "software": "Nuke · Maya · Substance Painter",
        "tags": ["Short film", "Comp & Lighting sup", "Look dev"],
        "video": ("vimeo", "886479681"),
        "video_label": "Watch GLARE on Vimeo",
        "image": "/assets/glare.jpg",
        "image_alt": "Still from GLARE short film — compositing and lighting supervision by Marc Castellví at La Salle BCN",
        "summary": "University short film at La Salle BCN. Compositing & Lighting supervisor, plus concept art, modeling, look development and texturing.",
        "body": """
<h2>What was my role?</h2>
<p><em>GLARE</em> is the short film I made with my team at <strong>La Salle BCN</strong>
as our bachelor's thesis project. I was <strong>Compositing &amp; Lighting
supervisor</strong>, and also contributed <strong>concept art, modeling, look development
and texturing</strong>.</p>

<h2>What I worked on</h2>
<ul>
  <li><strong>Compositing supervision</strong> — defining the comp workflow, building the
      shot templates and taking shots to final in Nuke.</li>
  <li><strong>Lighting supervision</strong> — designing the lighting language of the film and
      keeping it consistent across sequences.</li>
  <li><strong>Asset work</strong> — concept art, modeling, look dev and texturing on key
      assets.</li>
</ul>

<h2>Why this project matters</h2>
<p>GLARE is where I discovered that the intersection of image and pipeline is
where I want to work: supervising both lighting and comp on the same film
showed me how much each department gains when the other is done well.</p>
""",
    },
]


def video_embed(video, label):
    kind, vid = video
    if kind == "youtube":
        src = f"https://www.youtube-nocookie.com/embed/{vid}"
        watch = f"https://www.youtube.com/watch?v={vid}"
        site = "YouTube"
    else:
        src = f"https://player.vimeo.com/video/{vid}"
        watch = f"https://vimeo.com/{vid}"
        site = "Vimeo"
    return f"""<div class="video-embed">
  <iframe src="{src}" title="{label}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
<p><a href="{watch}" target="_blank" rel="noopener">{label} ↗</a></p>""", watch, site


def project_page(p):
    path = f"/projects/{p['slug']}/"
    embed, watch, site = video_embed(p["video"], p["video_label"])
    tags = "".join(f'<span class="tag">{t}</span>' for t in p["tags"])
    body = f"""<span class="kicker mono">{p['studio']}</span>
<h1 class="display">{p['title']}</h1>
<p class="lede">{p['summary']}</p>

{embed}

<div class="slate mono">
  <div class="row"><span class="k">Role</span><span class="v">{p['role']}</span></div>
  <div class="row"><span class="k">Studio</span><span class="v">{p['studio']}</span></div>
  <div class="row"><span class="k">Dates</span><span class="v">{p['dates']}</span></div>
  <div class="row"><span class="k">Software</span><span class="v">{p['software']}</span></div>
</div>

{p['body']}

<div class="tags">{tags}</div>

<p style="margin-top:2.4rem"><a class="btn" href="/projects/">← All projects</a>
<a class="btn primary" href="/contact/">Get in touch</a></p>
"""
    ld = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "@id": SITE + path + "#work",
        "name": p["title"],
        "url": SITE + path,
        "image": SITE + p["image"],
        "description": p["summary"],
        "contributor": {"@id": PERSON_ID},
        "sourceOrganization": {"@type": "Organization", "name": p["studio"]},
        "sameAs": watch,
    }
    render(
        path,
        title=f"{p['title']} — {p['role']} | Marc Castellví",
        description=p["summary"][:300],
        body=body,
        crumbs=[("Home", "/"), ("Projects", "/projects/"), (p["title"], None)],
        extra_ld=ld,
        og_image=SITE + p["image"],
        og_type="article",
        active="projects",
    )


# ═══════════════════════════════════════════════════════════════
# PROJECTS INDEX
# ═══════════════════════════════════════════════════════════════
def projects_index():
    cards = []
    for p in PROJECTS:
        cards.append(f"""<article class="card">
  <a href="/projects/{p['slug']}/"><img src="{p['image']}" alt="{p['image_alt']}" width="640" height="360" loading="lazy" decoding="async"></a>
  <span class="studio">{p['studio']}</span>
  <h2><a class="title-link" href="/projects/{p['slug']}/">{p['title']}</a></h2>
  <p>{p['role']} · {p['summary'].split(':')[0] if ':' in p['summary'] else p['summary']}</p>
</article>""")
    body = f"""<h1 class="display">VFX &amp; Animation Projects</h1>
<p class="lede">Feature films, series and shorts I have worked on as a compositing
and lighting artist — including <a href="/projects/spellbound/">Spellbound</a> and
<a href="/projects/swapped/">Swapped</a> at Skydance Animation,
<a href="/projects/sky-the-two-embers/">Sky: The Two Embers</a> at Illusorium Studios
and <a href="/projects/pocoyo-season-5/">Pocoyó</a> at Cocolilo Animation.
Each project page covers my role, the software and the technical challenges.</p>

<div class="card-grid">
{chr(10).join(cards)}
</div>

<h2>Upcoming projects</h2>
<p>I'm currently working on an unannounced animated feature at Skydance
Animation (shot compositing and Nuke template &amp; tool development), plus
unreleased productions from my time at Illusorium Studios. Details under NDA.</p>
"""
    ld = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": SITE + "/projects/#page",
        "url": SITE + "/projects/",
        "name": "VFX & Animation Projects — Marc Castellví",
        "about": {"@id": PERSON_ID},
        "hasPart": [
            {"@type": "CreativeWork", "name": p["title"], "url": SITE + f"/projects/{p['slug']}/"}
            for p in PROJECTS
        ],
    }
    render(
        "/projects/",
        title="Projects | Marc Castellví — Compositing & Lighting Artist",
        description="VFX and animation projects by Marc Castellví: Spellbound and Swapped (Skydance Animation, Netflix), Sky: The Two Embers, The Quinta's Ghost, Pocoyó season 5, and more. Nuke compositing, lighting and tools.",
        body=body,
        crumbs=[("Home", "/"), ("Projects", None)],
        extra_ld=ld,
        wide=True,
        active="projects",
    )


# ═══════════════════════════════════════════════════════════════
# ABOUT
# ═══════════════════════════════════════════════════════════════
def about_page():
    body = """<span class="kicker mono">ABOUT</span>
<h1 class="display">About Marc Castellví</h1>
<p class="lede">Junior Compositing Artist at Skydance Animation, based in Madrid.
Specialized in Nuke, CG compositing, lighting and compositing pipeline tools.</p>

<h2>Who I am</h2>
<p>I'm a 3D animation compositor, trained at <strong>La Salle BCN</strong> (Bachelor's
Degree in Animation, Interactive Technology, Video Graphics and Special Effects,
2019–2023) and currently <strong>Junior Compositing Artist at Skydance
Animation</strong> in Madrid, working on an upcoming animated feature.</p>

<p>Across feature film and series — <a href="/projects/spellbound/">Spellbound</a>
and <a href="/projects/swapped/">Swapped</a> at Skydance Animation,
<a href="/projects/sky-the-two-embers/">Sky: The Two Embers</a> and
<a href="/projects/the-quintas-ghost/">The Quinta's Ghost</a> at Illusorium
Studios, <a href="/projects/pocoyo-season-5/">Pocoyó</a> at Cocolilo Animation —
I've combined shot compositing with technical development: Nuke templates,
compositing tools and pipeline work for the comp team.</p>

<p>That dual background, artistic and technical, is the core of my profile: I
understand the shot and I understand the pipeline that makes it possible, and I
enjoy improving both.</p>

<div class="slate mono">
  <div class="row"><span class="k">Role</span><span class="v">Junior Compositing Artist</span></div>
  <div class="row"><span class="k">Studio</span><span class="v">Skydance Animation</span></div>
  <div class="row"><span class="k">Based in</span><span class="v">Madrid, Spain</span></div>
  <div class="row"><span class="k">Education</span><span class="v">La Salle BCN (URL)</span></div>
  <div class="row"><span class="k">Software</span><span class="v">Nuke · Python</span></div>
</div>

<h2>Experience</h2>
<ul>
  <li><strong>Junior Compositing Artist</strong> — Skydance Animation, Madrid (Jun 2026 — present).
      Shot compositing and Nuke template &amp; tool development on an upcoming animated feature.</li>
  <li><strong>Compositing Artist &amp; Compositing TA</strong> — Illusorium Studios, Madrid (Jan 2025 — Jun 2026).
      Artistic 3D compositing on <em>Sky: The Two Embers — Part 1</em>; lighting and comp tools on <em>The Quinta's Ghost</em>.</li>
  <li><strong>Compositing Artist | TD</strong> — Cocolilo Animation (Mar 2025 — Jul 2025).
      Compositing and Nuke pipeline development for <em>Pocoyó</em> season 5.</li>
  <li><strong>Compositing Trainee</strong> — Skydance Animation, Madrid (May 2024 — Jul 2024).
      Compositing tools and the DiMatte workflow on <em>Swapped</em> (Netflix).</li>
  <li><strong>Lighting Assistant</strong> — Skydance Animation, Madrid (Jan 2024 — May 2024).
      Scene prep, renders and layer QC on <em>Spellbound</em> (Netflix).</li>
  <li><strong>Bachelor's Degree</strong> — La Salle BCN, Barcelona (2019 — 2023).
      Animation, Interactive Technology, Video Graphics and Special Effects.</li>
</ul>

<h2>Skills</h2>
<div class="tags">
  <span class="tag">Nuke</span><span class="tag">Python</span>
  <span class="tag">Multipass compositing</span><span class="tag">AOVs / Cryptomatte</span>
  <span class="tag">FX integration</span><span class="tag">Templates &amp; tools (TA/TD)</span>
  <span class="tag">DiMattes</span><span class="tag">Lighting</span>
</div>

<p style="margin-top:2.4rem"><a class="btn primary" href="/projects/">See my projects</a>
<a class="btn" href="/contact/">Get in touch</a></p>
"""
    ld = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "@id": SITE + "/about/#page",
        "url": SITE + "/about/",
        "name": "About Marc Castellví — Compositing & Lighting Artist",
        "mainEntity": {"@id": PERSON_ID},
    }
    render(
        "/about/",
        title="About | Marc Castellví — Compositing & Lighting Artist",
        description="Marc Castellví is a Junior Compositing Artist at Skydance Animation in Madrid, trained at La Salle BCN. Nuke compositing, lighting and pipeline tools on Spellbound, Swapped, Pocoyó and more.",
        body=body,
        crumbs=[("Home", "/"), ("About", None)],
        extra_ld=ld,
        active="about",
    )


# ═══════════════════════════════════════════════════════════════
# REEL
# ═══════════════════════════════════════════════════════════════
def reel_page():
    rows = []
    for p in PROJECTS:
        kind, vid = p["video"]
        watch = (f"https://www.youtube.com/watch?v={vid}" if kind == "youtube"
                 else f"https://vimeo.com/{vid}")
        rows.append(f"""<article class="card">
  <a href="/projects/{p['slug']}/"><img src="{p['image']}" alt="{p['image_alt']}" width="640" height="360" loading="lazy" decoding="async"></a>
  <span class="studio">{p['studio']}</span>
  <h2><a class="title-link" href="/projects/{p['slug']}/">{p['title']}</a></h2>
  <p>{p['role']}</p>
  <p><a href="{watch}" target="_blank" rel="noopener">Watch full video ↗</a></p>
</article>""")
    body = f"""<span class="kicker mono">REEL</span>
<h1 class="display">Compositing &amp; Lighting Reel</h1>
<p class="lede">A selection of the productions I've worked on as a compositing and
lighting artist. The <a href="/#proyectos">interactive reel on the home page</a>
plays a curated clip from each project — below you'll find every piece with a
link to the full video and a detailed breakdown page.</p>

<div class="card-grid">
{chr(10).join(rows)}
</div>
"""
    ld = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": SITE + "/reel/#page",
        "url": SITE + "/reel/",
        "name": "Compositing & Lighting Reel — Marc Castellví",
        "about": {"@id": PERSON_ID},
    }
    render(
        "/reel/",
        title="Reel | Marc Castellví — Compositing & Lighting Artist",
        description="Compositing and lighting reel of Marc Castellví: clips and full videos from Spellbound, Swapped, Sky: The Two Embers, Pocoyó and more, with per-project breakdowns.",
        body=body,
        crumbs=[("Home", "/"), ("Reel", None)],
        extra_ld=ld,
        wide=True,
        active="reel",
    )


# ═══════════════════════════════════════════════════════════════
# BLOG
# ═══════════════════════════════════════════════════════════════
ARTICLES = [
    {
        "slug": "nuke-compositing-workflow-animation",
        "title": "How I Build a Compositing Workflow in Nuke for Animation Features",
        "date": "2026-07-22",
        "date_h": "July 22, 2026",
        "description": "A practical look at how I structure Nuke compositing workflows for animated features and series: templates, multipass AOVs, Cryptomatte, DiMattes and the tools that keep a comp team fast and consistent.",
        "body": """
<p>Over the last few years I've worked on the comp side of animated features
and series at <a href="/projects/spellbound/">Skydance Animation</a>, Illusorium
Studios and Cocolilo Animation — sometimes as a shot artist, often as the
person building the templates and tools the rest of the team relies on. This
article is a practical summary of how I approach a Nuke compositing workflow
for animation, and the decisions that matter most.</p>

<h2>1. Start from the template, not the shot</h2>
<p>In animation, comp is a volume game: hundreds of shots that share the same
render structure. The single highest-leverage thing you can do is invest in a
solid <strong>shot template</strong> — a Nuke script that already knows how to read the
show's passes, rebuild the beauty, and route mattes and FX elements, so an
artist opens a shot and starts making creative decisions immediately instead of
wiring nodes.</p>
<p>A good template has three properties:</p>
<ul>
  <li><strong>Predictable structure</strong> — every shot looks the same, so anyone can open
      anyone's script and know where things are.</li>
  <li><strong>Safe defaults</strong> — the un-touched template output should already look
      close to the lighting render. Comp adds, it doesn't repair.</li>
  <li><strong>Escape hatches</strong> — artists must be able to break out of the template for
      hero shots without fighting it.</li>
</ul>

<h2>2. Respect the AOV structure</h2>
<p>Having worked as a <a href="/projects/spellbound/">lighting assistant</a> before
moving to comp, I learned to treat the render's AOV structure as a contract
between departments. The comp template rebuilds the beauty from light groups
and AOVs, which gives comp enormous grading power — but only if the rebuild is
mathematically exact. Verify it with a difference against the beauty on every
show setup, and automate that check if you can.</p>

<h2>3. Mattes are a workflow, not a node</h2>
<p>On <a href="/projects/swapped/">Swapped</a> I owned the DiMatte workflow, and it
changed how I think about mattes. Cryptomatte is great for ad-hoc picking, but
a production needs <strong>named, versioned, consistent mattes</strong> that arrive in
every shot the same way. Define naming conventions early, build the template to
consume them automatically, and give artists one obvious tool to request or
generate a matte that doesn't exist yet.</p>

<h2>4. Move look decisions into comp when it's cheaper</h2>
<p>Some look tweaks don't need a re-render. On the
<a href="/projects/blacksad/">Blacksad fan-art piece</a> I built a triplanar STMap
tool that uses Position and Normal passes to apply 2D textures directly in
comp, tracking the assets through the shot. That kind of tool turns a
days-long texture/render round trip into minutes inside Nuke. Every show has a
handful of these opportunities — find them.</p>

<h2>5. Automate the boring 20%</h2>
<p>As a TD on <a href="/projects/pocoyo-season-5/">Pocoyó season 5</a> my job was
essentially to remove friction: automatic script setup, read/write node
management, versioning, delivery. Python inside Nuke pays for itself
immediately in episodic work. My rule of thumb: if an artist does the same
five clicks in every shot, that's a tool.</p>

<h2>Closing thoughts</h2>
<p>The artistic and technical sides of compositing aren't separate jobs — the
best comp teams I've been part of treat the pipeline as part of the image.
If the template is solid, the mattes are reliable and the boring parts are
automated, artists spend their day on what actually shows up on screen.</p>

<p><em>Want to talk comp workflows, or see this thinking applied to real
productions? Check my <a href="/projects/">projects</a> or
<a href="/contact/">get in touch</a>.</em></p>
""",
    },
]


def article_page(a):
    path = f"/blog/{a['slug']}/"
    body = f"""<article class="prose">
<span class="kicker mono">BLOG</span>
<h1 class="display">{a['title']}</h1>
<p class="meta">By Marc Castellví · {a['date_h']}</p>
{a['body']}
</article>

<p style="margin-top:2.4rem"><a class="btn" href="/blog/">← All articles</a></p>
"""
    ld = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "@id": SITE + path + "#article",
        "headline": a["title"],
        "description": a["description"],
        "url": SITE + path,
        "datePublished": a["date"],
        "dateModified": a["date"],
        "inLanguage": "en",
        "image": OG_IMAGE,
        "author": {"@id": PERSON_ID},
        "publisher": {"@id": PERSON_ID},
        "mainEntityOfPage": SITE + path,
    }
    render(
        path,
        title=f"{a['title']} | Marc Castellví",
        description=a["description"],
        body=body,
        crumbs=[("Home", "/"), ("Blog", "/blog/"), (a["title"], None)],
        extra_ld=ld,
        og_type="article",
        active="blog",
    )


def blog_index():
    cards = []
    for a in ARTICLES:
        cards.append(f"""<article class="card">
  <span class="studio">{a['date_h']}</span>
  <h2><a class="title-link" href="/blog/{a['slug']}/">{a['title']}</a></h2>
  <p>{a['description']}</p>
</article>""")
    body = f"""<span class="kicker mono">BLOG</span>
<h1 class="display">VFX &amp; Compositing Blog</h1>
<p class="lede">Technical articles about Nuke compositing, lighting and pipeline
tools for animation, written from real production experience at Skydance
Animation, Illusorium Studios and Cocolilo Animation.</p>

<div class="card-grid">
{chr(10).join(cards)}
</div>
"""
    ld = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "@id": SITE + "/blog/#blog",
        "url": SITE + "/blog/",
        "name": "Marc Castellví — VFX & Compositing Blog",
        "description": "Technical articles about Nuke compositing, lighting and pipeline tools for animation.",
        "inLanguage": "en",
        "author": {"@id": PERSON_ID},
        "blogPost": [
            {"@type": "TechArticle", "headline": a["title"], "url": SITE + f"/blog/{a['slug']}/", "datePublished": a["date"]}
            for a in ARTICLES
        ],
    }
    render(
        "/blog/",
        title="Blog | Marc Castellví — Nuke Compositing & VFX Articles",
        description="Technical articles by Marc Castellví about Nuke compositing, lighting and pipeline tools for animation, from real production experience.",
        body=body,
        crumbs=[("Home", "/"), ("Blog", None)],
        extra_ld=ld,
        wide=True,
        active="blog",
    )


# ═══════════════════════════════════════════════════════════════
# CONTACT
# ═══════════════════════════════════════════════════════════════
def contact_page():
    body = """<span class="kicker mono">CONTACT</span>
<h1 class="display">Get in Touch</h1>
<p class="lede">Shall we talk about your next shot? I'm always happy to hear about
compositing and lighting work, tools and pipeline challenges, or just to talk
Nuke.</p>

<div class="slate mono">
  <div class="row"><span class="k">Email</span><span class="v"><a href="mailto:vmarccastellvi@gmail.com">vmarccastellvi@gmail.com</a></span></div>
  <div class="row"><span class="k">LinkedIn</span><span class="v"><a href="https://www.linkedin.com/in/marc-castellvi-vila/" target="_blank" rel="noopener">marc-castellvi-vila</a></span></div>
  <div class="row"><span class="k">Based in</span><span class="v">Madrid, Spain</span></div>
  <div class="row"><span class="k">Languages</span><span class="v">English · Spanish · Catalan</span></div>
</div>

<p style="margin-top:2.4rem">
<a class="btn primary" href="mailto:vmarccastellvi@gmail.com">Email me</a>
<a class="btn" href="https://www.linkedin.com/in/marc-castellvi-vila/" target="_blank" rel="noopener">LinkedIn ↗</a>
</p>
"""
    ld = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "@id": SITE + "/contact/#page",
        "url": SITE + "/contact/",
        "name": "Contact Marc Castellví — Compositing & Lighting Artist",
        "mainEntity": {"@id": PERSON_ID},
    }
    render(
        "/contact/",
        title="Contact | Marc Castellví — Compositing & Lighting Artist",
        description="Contact Marc Castellví, Junior Compositing Artist at Skydance Animation in Madrid. Email and LinkedIn for compositing, lighting and VFX work.",
        body=body,
        crumbs=[("Home", "/"), ("Contact", None)],
        extra_ld=ld,
        active="contact",
    )


if __name__ == "__main__":
    about_page()
    projects_index()
    for p in PROJECTS:
        project_page(p)
    reel_page()
    blog_index()
    for a in ARTICLES:
        article_page(a)
    contact_page()
