import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Política de Privacidad</h1>
        <p className="text-muted-foreground">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>1. Información que Recopilamos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1.1 Información de Cuenta</h3>
            <p className="text-muted-foreground">
              Cuando te registras en Yiyermo Sign Language Translator, recopilamos:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
              <li>Nombre completo</li>
              <li>Dirección de correo electrónico</li>
              <li>Contraseña (encriptada)</li>
              <li>Fecha de registro</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">1.2 Información de Uso</h3>
            <p className="text-muted-foreground">
              Recopilamos información sobre cómo utilizas nuestra plataforma:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
              <li>Historial de traducciones (texto traducido y modo de traducción)</li>
              <li>Duración de sesiones de uso</li>
              <li>Frecuencia de uso de la plataforma</li>
              <li>Configuraciones y preferencias del usuario</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">1.3 Información Técnica</h3>
            <p className="text-muted-foreground">
              Recopilamos automáticamente cierta información técnica:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
              <li>Dirección IP</li>
              <li>Tipo de navegador y versión</li>
              <li>Sistema operativo</li>
              <li>Información del dispositivo</li>
              <li>Páginas visitadas y tiempo de navegación</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>2. Cómo Utilizamos tu Información</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>Utilizamos la información recopilada para:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Proporcionar y mantener nuestro servicio de traducción</li>
            <li>Mejorar la precisión y funcionalidad del traductor</li>
            <li>Personalizar tu experiencia de usuario</li>
            <li>Guardar tu historial de traducciones para tu conveniencia</li>
            <li>Generar estadísticas de uso anónimas</li>
            <li>Enviar notificaciones importantes sobre el servicio</li>
            <li>Detectar y prevenir fraudes o uso indebido</li>
            <li>Cumplir con obligaciones legales</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>3. Compartir Información</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            No vendemos ni alquilamos tu información personal a terceros. Podemos compartir información únicamente en los siguientes casos:
          </p>
          
          <div>
            <h3 className="font-semibold mb-2">3.1 Proveedores de Servicios</h3>
            <p className="text-muted-foreground">
              Compartimos información con proveedores que nos ayudan a operar nuestra plataforma:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
              <li>Supabase (almacenamiento de datos y autenticación)</li>
              <li>Servicios de hosting y CDN</li>
              <li>Herramientas de análisis de uso</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3.2 Requisitos Legales</h3>
            <p className="text-muted-foreground">
              Podemos divulgar información si es requerido por ley o para proteger nuestros derechos legales.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>4. Seguridad de los Datos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Encriptación de contraseñas mediante algoritmos seguros</li>
            <li>Comunicaciones cifradas mediante HTTPS/SSL</li>
            <li>Acceso restringido a datos personales</li>
            <li>Monitoreo regular de vulnerabilidades de seguridad</li>
            <li>Copias de seguridad periódicas</li>
          </ul>
          <p className="mt-4">
            Sin embargo, ningún método de transmisión por Internet es 100% seguro. No podemos garantizar la seguridad absoluta de tus datos.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>5. Retención de Datos</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-3">
          <p>
            Retenemos tu información personal mientras tu cuenta esté activa o según sea necesario para proporcionarte servicios.
          </p>
          <p>
            Si deseas eliminar tu cuenta, puedes hacerlo desde tu perfil o contactándonos. Eliminaremos tu información personal en un plazo de 30 días, excepto cuando debamos retenerla por obligaciones legales.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>6. Tus Derechos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>Tienes derecho a:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Acceder</strong> a tu información personal</li>
            <li><strong>Rectificar</strong> datos inexactos o incompletos</li>
            <li><strong>Eliminar</strong> tu cuenta y datos personales</li>
            <li><strong>Exportar</strong> tus datos en formato legible</li>
            <li><strong>Oponerte</strong> al procesamiento de tus datos</li>
            <li><strong>Revocar</strong> el consentimiento en cualquier momento</li>
          </ul>
          <p className="mt-4">
            Para ejercer estos derechos, contáctanos a través de: <strong>privacy@yiyermo.com</strong>
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>7. Cookies y Tecnologías Similares</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-3">
          <p>
            Utilizamos cookies y tecnologías similares para mejorar tu experiencia:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Cookies esenciales:</strong> necesarias para el funcionamiento del sitio</li>
            <li><strong>Cookies de preferencias:</strong> guardan tus configuraciones</li>
            <li><strong>Cookies analíticas:</strong> nos ayudan a entender cómo usas el servicio</li>
          </ul>
          <p className="mt-4">
            Puedes configurar tu navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del sitio.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>8. Privacidad de Menores</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            Nuestro servicio está destinado a usuarios mayores de 13 años. No recopilamos intencionalmente información de menores de 13 años. Si descubrimos que hemos recopilado información de un menor de 13 años, la eliminaremos de inmediato.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>9. Cambios a esta Política</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            Podemos actualizar esta Política de Privacidad periódicamente. Te notificaremos sobre cambios significativos publicando la nueva política en esta página y actualizando la fecha de "Última actualización".
          </p>
          <p className="mt-3">
            Te recomendamos revisar esta política periódicamente para estar informado sobre cómo protegemos tu información.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>10. Contacto</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p className="mb-3">
            Si tienes preguntas sobre esta Política de Privacidad, puedes contactarnos:
          </p>
          <ul className="space-y-2">
            <li><strong>Email:</strong> privacy@yiyermo.com</li>
            <li><strong>Email general:</strong> support@yiyermo.com</li>
          </ul>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Al utilizar Yiyermo Sign Language Translator, aceptas esta Política de Privacidad y nuestros{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Términos de Uso
          </Link>
          .
        </p>
      </div>
    </div>
  );
}