import Nav from '@/components/Nav'
import Returns from '@/components/Returns'
import PlaceTrade from '@/components/PlaceTrade'

export default function Page() {
  return (
    <div className="p-14 w-full flex flex-col justify-center items-center">
      <h1 className="text-3xl text-center font-bold">Awesome App</h1>
      <Nav />
      <Returns />
      <PlaceTrade />
    </div>
  )
}
