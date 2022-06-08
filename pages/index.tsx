import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect } from 'react'
import { getPages, getPage, getBlocks } from '../lib/notion'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

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
  }
}

export async function getServerSideProps () {
  const { results } = await getPages()
  const randomIdx = Math.floor(Math.random() * results.length)
  const page = await getPage(results[randomIdx].id)
  const blocks = await getBlocks(results[randomIdx].id)
  return {
    props: {
      page: page,
      blocks: blocks
    }
  }
}

interface Props {
  page: [any],
  blocks: [any]
}

const Home: NextPage<Props> = (props) => {
  useEffect(() => {
    console.log('page', props.page)
    console.log('blocks', props.blocks)
  }, [])
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        {props.blocks.map(block => {
          return renderBlock(block)
        })}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
