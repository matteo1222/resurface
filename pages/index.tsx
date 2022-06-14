import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import { getPages, getPage, getBlocks, getRecordMap } from '../lib/notion'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { format } from 'date-fns'
import { NotionRenderer } from 'react-notion-x'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then((m) => m.Code)
)
const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then(
    (m) => m.Collection
  )
)
const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
)
const Pdf = dynamic(
  () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
  {
    ssr: false
  }
)
const Modal = dynamic(
  () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
  {
    ssr: false
  }
)

const renderBlock = (block: any) => {
  switch (block.type) {
    case 'code':
      return (
        <pre>
          <code>
            <SyntaxHighlighter language={block.code.language} style={docco}>
              {block.code.rich_text[0].plain_text}
            </SyntaxHighlighter>
          </code>
        </pre>
      )
    case 'paragraph':
      return (
        <div>{block.paragraph.rich_text.map(text => <p>{text.plain_text}</p>)}</div>
      )
  }
}

export async function getServerSideProps () {
  const { results } = await getPages()
  const randomIdx = Math.floor(Math.random() * results.length)
  const page = await getPage(results[randomIdx].id)
  const blocks = await getBlocks(results[randomIdx].id)
  const recordMap = await getRecordMap(results[randomIdx].id)
  return {
    props: {
      page: page,
      blocks: blocks,
      recordMap: recordMap
    }
  }
}

interface Props {
  page: any,
  blocks: [any],
  recordMap: any
}

const Home: NextPage<Props> = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  useEffect(() => {
    console.log('page', props.page)
    console.log('blocks', props.blocks)
  }, [])

  useEffect(() => {
    setIsLoading(false)
  }, [props.recordMap])

  function refreshPage() {
    router.replace(router.asPath)
    setIsLoading(true)
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Resurface</title>
        <meta name="description" content="Resurface Old Notion Notes Randomly" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className='flex items-center justify-end w-full h-16'>
        <a
          href={props.page.url}
          target="_blank"
          rel="noopener noreferrer"
          className='bg-slate-400 rounded-sm m-1 px-2 py-1 text-sm text-white'
        >Open in Notion</a>
        <button
          onClick={refreshPage}
          className={`${isLoading ? 'bg-slate-300' : 'bg-slate-400'} rounded-sm m-1 min-w-[7rem] px-2 py-1 text-sm text-white`}
          disabled={isLoading}
        >{isLoading ? 'Loading' : 'Resurface Idea'}</button>
      </nav>
      <NotionRenderer
        recordMap={props.recordMap}
        fullPage={true}
        darkMode={false}
        components={{
          nextImage: Image,
          nextLink: Link,
          Code,
          Collection,
          Equation,
          Pdf,
          Modal
        }}
      />
      {/* <main className={styles.main}>
        <h1 className="text-3xl font-bold">
          {props.page.properties.Name.title[0].plain_text}
        </h1>
        <div>Created</div>
        <div>{format(new Date(props.page.created_time), 'LLLL dd, yyyy H:mm aa')}</div>
        <div>Tags</div>
        <div>{props.page.properties.Tags.multi_select.map(select => <span key={select.id}>{select.name}</span>)}</div>
        {props.blocks.map(block => {
          return renderBlock(block)
        })}
      </main> */}

      <footer className={styles.footer}>
          Created by
          <span>
            <a
              href='https://twitter.com/matteolululu'
              target='_blank'
              rel="noopener noreferrer"
              className='text-cyan-500 ml-1'
            >
              @matteolululu
            </a>
          </span>
      </footer>
    </div>
  )
}

export default Home
