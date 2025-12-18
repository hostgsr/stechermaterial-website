import {parseBody} from 'next-sanity/webhook'
import {revalidatePath, revalidateTag} from 'next/cache'
import {NextResponse, type NextRequest} from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const {body, isValidSignature} = await parseBody<{
      _type: string
      slug?: {current: string}
    }>(req, process.env.SANITY_REVALIDATE_SECRET)

    if (!isValidSignature) {
      const message = 'Invalid signature'
      return new Response(JSON.stringify({message, isValidSignature, body}), {
        status: 401,
      })
    }

    if (!body?._type) {
      const message = 'Bad Request'
      return new Response(JSON.stringify({message, body}), {status: 400})
    }

    // Revalidate based on document type
    switch (body._type) {
      case 'home':
        revalidatePath('/')
        break
      case 'project':
        revalidatePath('/')
        if (body.slug?.current) {
          revalidatePath(`/projects/${body.slug.current}`)
        }
        break
      case 'work':
        revalidatePath('/works')
        if (body.slug?.current) {
          revalidatePath(`/works/${body.slug.current}`)
        }
        break
      case 'exhibition':
        revalidatePath('/exhibitions')
        if (body.slug?.current) {
          revalidatePath(`/exhibitions/${body.slug.current}`)
        }
        break
      case 'collection':
        revalidatePath('/collections')
        if (body.slug?.current) {
          revalidatePath(`/collections/${body.slug.current}`)
        }
        break
      case 'publication':
        revalidatePath('/publications')
        break
      default:
        // For any other document type, revalidate the homepage
        revalidatePath('/')
        break
    }

    const message = `Updated route: ${body._type}`
    return NextResponse.json({body, message})
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({message: 'Internal server error', err}), {status: 500})
  }
}
