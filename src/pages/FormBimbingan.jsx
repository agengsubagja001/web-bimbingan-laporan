import React, { useState } from 'react'
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'

export default function FormBimbingan(){
  const [form, setForm] = useState({ nisn:'', nama:'', tanggal:'', keterangan:'', kode_pembimbing:'' })
  const [msg, setMsg] = useState('')

  const handleSubmit = async (e) =>{
    e.preventDefault()
    setMsg('')
    try{
      const q = query(collection(db,'pembimbing'), where('kode_pembimbing','==', form.kode_pembimbing))
      const snap = await getDocs(q)
      if(snap.empty){
        setMsg('Kode pembimbing tidak valid. Hubungi pembimbing Anda.')
        return
      }
      await addDoc(collection(db,'bimbingan'), {
        nisn: form.nisn,
        nama: form.nama,
        tanggal: form.tanggal,
        keterangan: form.keterangan,
        kode_pembimbing: form.kode_pembimbing,
        created_at: serverTimestamp()
      })
      setMsg('Berhasil menyimpan bimbingan')
      setForm({ nisn:'', nama:'', tanggal:'', keterangan:'', kode_pembimbing:'' })
    }catch(err){
      setMsg('Gagal menyimpan: ' + err.message)
    }
  }

  return (
    <div>
      <h2>Form Bimbingan Siswa</h2>
      <form onSubmit={handleSubmit} style={{display:'grid', gap:8}}>
        <input className="input" required placeholder="NISN" value={form.nisn} onChange={e=>setForm({...form, nisn:e.target.value})} />
        <input className="input" required placeholder="Nama" value={form.nama} onChange={e=>setForm({...form, nama:e.target.value})} />
        <input className="input" required type="date" value={form.tanggal} onChange={e=>setForm({...form, tanggal:e.target.value})} />
        <textarea className="input" required placeholder="Keterangan bimbingan" value={form.keterangan} onChange={e=>setForm({...form, keterangan:e.target.value})} />
        <input className="input" required placeholder="Kode Pembimbing" value={form.kode_pembimbing} onChange={e=>setForm({...form, kode_pembimbing:e.target.value})} />
        <div style={{display:'flex', gap:8}}>
          <button className="btn btn-primary" type="submit">Submit</button>
        </div>
        {msg && <div className="small">{msg}</div>}
      </form>
    </div>
  )
}
