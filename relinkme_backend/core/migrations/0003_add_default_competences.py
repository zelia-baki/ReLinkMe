from django.db import migrations

def create_competences(apps, schema_editor):
    Competence = apps.get_model('core', 'Competence')
    
    competences_data = [
        # ============================================================
        # 💻 FRONTEND
        # ============================================================
        {"libelle": "HTML5", "categorie": "Frontend"},
        {"libelle": "CSS3", "categorie": "Frontend"},
        {"libelle": "JavaScript", "categorie": "Frontend"},
        {"libelle": "TypeScript", "categorie": "Frontend"},
        {"libelle": "React.js", "categorie": "Frontend"},
        {"libelle": "Vue.js", "categorie": "Frontend"},
        {"libelle": "Angular", "categorie": "Frontend"},
        {"libelle": "Next.js", "categorie": "Frontend"},
        {"libelle": "Nuxt.js", "categorie": "Frontend"},
        {"libelle": "Svelte", "categorie": "Frontend"},
        {"libelle": "Redux", "categorie": "Frontend"},
        {"libelle": "Tailwind CSS", "categorie": "Frontend"},
        {"libelle": "Bootstrap", "categorie": "Frontend"},
        {"libelle": "Material-UI", "categorie": "Frontend"},
        {"libelle": "Sass/SCSS", "categorie": "Frontend"},
        {"libelle": "jQuery", "categorie": "Frontend"},
        {"libelle": "Webpack", "categorie": "Frontend"},
        {"libelle": "Vite", "categorie": "Frontend"},

        # ============================================================
        # ⚙️ BACKEND
        # ============================================================
        {"libelle": "Python", "categorie": "Backend"},
        {"libelle": "Django", "categorie": "Backend"},
        {"libelle": "Django REST Framework", "categorie": "Backend"},
        {"libelle": "Flask", "categorie": "Backend"},
        {"libelle": "FastAPI", "categorie": "Backend"},
        {"libelle": "Node.js", "categorie": "Backend"},
        {"libelle": "Express.js", "categorie": "Backend"},
        {"libelle": "NestJS", "categorie": "Backend"},
        {"libelle": "PHP", "categorie": "Backend"},
        {"libelle": "Laravel", "categorie": "Backend"},
        {"libelle": "Symfony", "categorie": "Backend"},
        {"libelle": "Ruby on Rails", "categorie": "Backend"},
        {"libelle": "Java", "categorie": "Backend"},
        {"libelle": "Spring Boot", "categorie": "Backend"},
        {"libelle": "C#", "categorie": "Backend"},
        {"libelle": ".NET Core", "categorie": "Backend"},
        {"libelle": "Go (Golang)", "categorie": "Backend"},
        {"libelle": "Rust", "categorie": "Backend"},

        # ============================================================
        # 🗄️ BASES DE DONNÉES
        # ============================================================
        {"libelle": "SQL", "categorie": "Database"},
        {"libelle": "MySQL", "categorie": "Database"},
        {"libelle": "PostgreSQL", "categorie": "Database"},
        {"libelle": "SQLite", "categorie": "Database"},
        {"libelle": "MongoDB", "categorie": "Database"},
        {"libelle": "Redis", "categorie": "Database"},
        {"libelle": "Firebase", "categorie": "Database"},
        {"libelle": "Elasticsearch", "categorie": "Database"},
        {"libelle": "Oracle Database", "categorie": "Database"},
        {"libelle": "Microsoft SQL Server", "categorie": "Database"},
        {"libelle": "MariaDB", "categorie": "Database"},
        {"libelle": "Cassandra", "categorie": "Database"},
        {"libelle": "DynamoDB", "categorie": "Database"},

        # ============================================================
        # 📱 MOBILE
        # ============================================================
        {"libelle": "React Native", "categorie": "Mobile"},
        {"libelle": "Flutter", "categorie": "Mobile"},
        {"libelle": "Swift", "categorie": "Mobile"},
        {"libelle": "Kotlin", "categorie": "Mobile"},
        {"libelle": "Java Android", "categorie": "Mobile"},
        {"libelle": "Ionic", "categorie": "Mobile"},
        {"libelle": "Xamarin", "categorie": "Mobile"},

        # ============================================================
        # ☁️ CLOUD & DEVOPS
        # ============================================================
        {"libelle": "Docker", "categorie": "DevOps"},
        {"libelle": "Kubernetes", "categorie": "DevOps"},
        {"libelle": "AWS", "categorie": "Cloud"},
        {"libelle": "Azure", "categorie": "Cloud"},
        {"libelle": "Google Cloud Platform", "categorie": "Cloud"},
        {"libelle": "Heroku", "categorie": "Cloud"},
        {"libelle": "DigitalOcean", "categorie": "Cloud"},
        {"libelle": "CI/CD", "categorie": "DevOps"},
        {"libelle": "Jenkins", "categorie": "DevOps"},
        {"libelle": "GitLab CI", "categorie": "DevOps"},
        {"libelle": "GitHub Actions", "categorie": "DevOps"},
        {"libelle": "Terraform", "categorie": "DevOps"},
        {"libelle": "Ansible", "categorie": "DevOps"},
        {"libelle": "Nginx", "categorie": "DevOps"},
        {"libelle": "Apache", "categorie": "DevOps"},

        # ============================================================
        # 🔧 OUTILS & VERSION CONTROL
        # ============================================================
        {"libelle": "Git", "categorie": "Version Control"},
        {"libelle": "GitHub", "categorie": "Version Control"},
        {"libelle": "GitLab", "categorie": "Version Control"},
        {"libelle": "Bitbucket", "categorie": "Version Control"},
        {"libelle": "SVN", "categorie": "Version Control"},

        # ============================================================
        # 🧪 TESTS
        # ============================================================
        {"libelle": "Jest", "categorie": "Testing"},
        {"libelle": "Pytest", "categorie": "Testing"},
        {"libelle": "Selenium", "categorie": "Testing"},
        {"libelle": "Cypress", "categorie": "Testing"},
        {"libelle": "Postman", "categorie": "Testing"},
        {"libelle": "JUnit", "categorie": "Testing"},
        {"libelle": "Mocha", "categorie": "Testing"},

        # ============================================================
        # 🎨 DESIGN & UI/UX
        # ============================================================
        {"libelle": "Figma", "categorie": "Design"},
        {"libelle": "Adobe XD", "categorie": "Design"},
        {"libelle": "Sketch", "categorie": "Design"},
        {"libelle": "Photoshop", "categorie": "Design"},
        {"libelle": "Illustrator", "categorie": "Design"},
        {"libelle": "UI/UX Design", "categorie": "Design"},
        {"libelle": "Responsive Design", "categorie": "Design"},

        # ============================================================
        # 🤖 DATA SCIENCE & AI
        # ============================================================
        {"libelle": "Machine Learning", "categorie": "Data Science"},
        {"libelle": "Deep Learning", "categorie": "Data Science"},
        {"libelle": "TensorFlow", "categorie": "Data Science"},
        {"libelle": "PyTorch", "categorie": "Data Science"},
        {"libelle": "Pandas", "categorie": "Data Science"},
        {"libelle": "NumPy", "categorie": "Data Science"},
        {"libelle": "Scikit-learn", "categorie": "Data Science"},
        {"libelle": "Data Analysis", "categorie": "Data Science"},
        {"libelle": "Data Visualization", "categorie": "Data Science"},
        {"libelle": "Power BI", "categorie": "Data Science"},
        {"libelle": "Tableau", "categorie": "Data Science"},

        # ============================================================
        # 🔐 SÉCURITÉ
        # ============================================================
        {"libelle": "Cybersécurité", "categorie": "Security"},
        {"libelle": "OAuth", "categorie": "Security"},
        {"libelle": "JWT", "categorie": "Security"},
        {"libelle": "HTTPS/SSL", "categorie": "Security"},
        {"libelle": "Penetration Testing", "categorie": "Security"},
        {"libelle": "OWASP", "categorie": "Security"},

        # ============================================================
        # 📊 GESTION DE PROJET
        # ============================================================
        {"libelle": "Agile/Scrum", "categorie": "Gestion de projet"},
        {"libelle": "Jira", "categorie": "Gestion de projet"},
        {"libelle": "Trello", "categorie": "Gestion de projet"},
        {"libelle": "Notion", "categorie": "Gestion de projet"},
        {"libelle": "Asana", "categorie": "Gestion de projet"},
        {"libelle": "Monday.com", "categorie": "Gestion de projet"},

        # ============================================================
        # 💼 SOFT SKILLS
        # ============================================================
        {"libelle": "Communication", "categorie": "Soft Skills"},
        {"libelle": "Travail d'équipe", "categorie": "Soft Skills"},
        {"libelle": "Leadership", "categorie": "Soft Skills"},
        {"libelle": "Résolution de problèmes", "categorie": "Soft Skills"},
        {"libelle": "Gestion du temps", "categorie": "Soft Skills"},
        {"libelle": "Créativité", "categorie": "Soft Skills"},
        {"libelle": "Pensée critique", "categorie": "Soft Skills"},

        # ============================================================
        # 🌍 LANGUES
        # ============================================================
        {"libelle": "Français", "categorie": "Langues"},
        {"libelle": "Anglais", "categorie": "Langues"},
        {"libelle": "Espagnol", "categorie": "Langues"},
        {"libelle": "Allemand", "categorie": "Langues"},
        {"libelle": "Chinois", "categorie": "Langues"},
        {"libelle": "Arabe", "categorie": "Langues"},
        {"libelle": "Japonais", "categorie": "Langues"},

        # ============================================================
        # 📝 AUTRES COMPÉTENCES TECHNIQUES
        # ============================================================
        {"libelle": "API REST", "categorie": "Backend"},
        {"libelle": "GraphQL", "categorie": "Backend"},
        {"libelle": "WebSocket", "categorie": "Backend"},
        {"libelle": "Microservices", "categorie": "Architecture"},
        {"libelle": "Architecture Logicielle", "categorie": "Architecture"},
        {"libelle": "Clean Code", "categorie": "Best Practices"},
        {"libelle": "Design Patterns", "categorie": "Best Practices"},
        {"libelle": "TDD (Test-Driven Development)", "categorie": "Best Practices"},
    ]
    
    for comp_data in competences_data:
        Competence.objects.get_or_create(
            libelle=comp_data["libelle"],
            defaults={'categorie': comp_data["categorie"]}
        )

def remove_competences(apps, schema_editor):
    Competence = apps.get_model('core', 'Competence')
    Competence.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_initial'),  # ← Trouvez le bon numéro ci-dessous
    ]

    operations = [
        migrations.RunPython(create_competences, remove_competences),
    ]